import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  CaseItem,
  CaseEvent,
  Person,
  CaseDocument,
  LegalLawNode,
  StrategyNode,
  DamagesNode,
  LawyerNoteNode,
} from '../../types.ts';
import { AiStructuringModal } from './AiStructuringModal.tsx';
import { BlueprintImageSlot } from './BlueprintImageSlot.tsx';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Calendar,
  Users,
  FileText,
  Trash2,
  Upload,
  Plus,
  Paperclip,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  HelpCircle,
  FileCode,
  FileImage,
  File,
  Scale,
  ShieldAlert,
  Coins,
  Calculator,
  MessageSquare,
  CheckSquare2,
  Square,
  Flame,
  Layers,
  AlertCircle,
  AlertTriangle,
  Link2,
} from 'lucide-react';

interface MindMapViewProps {
  caseItem: CaseItem;
}

interface NodePosition {
  x: number;
  y: number;
}

type NodeCategory =
  | 'case'
  | 'person'
  | 'event'
  | 'document'
  | 'law'
  | 'strategy'
  | 'damages'
  | 'note';

interface DraggingState {
  nodeId: string;
  nodeType: NodeCategory;
  startX: number;
  startY: number;
  initialNodeX: number;
  initialNodeY: number;
}

interface WireConnectingState {
  fromNodeId: string;
  fromType: NodeCategory;
  fromX: number;
  fromY: number;
  currentX: number;
  currentY: number;
  color?: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
}

export const MindMapView: React.FC<MindMapViewProps> = ({ caseItem }) => {
  const {
    addEvent,
    deleteEvent,
    addPerson,
    deletePerson,
    addDocument,
    updateDocument,
    deleteDocument,
    updateNodePosition,
    updateNodeImage,
    addLegalLaw,
    deleteLegalLaw,
    toggleLawElement,
    addStrategy,
    deleteStrategy,
    addDamagesNode,
    deleteDamagesNode,
    addDamageItem,
    deleteDamageItem,
    addLawyerNote,
    deleteLawyerNote,
    updateLawyerNote,
    addCustomLink,
    removeCustomLink,
    autoOrganizeMindMap,
    lineStyle,
    setLineStyle,
    hideDefaultLink,
    restoreAllDefaultLinks,
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const [organizeToast, setOrganizeToast] = useState<string | null>(null);

  // Canvas Viewport Transforms
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rightClickDragRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    moved: false,
  });

  // Fullscreen state: "ในหน้า Mind Map กดไปให้เต็มจอแค่ส่วนของ Mind Map เลย"
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // High-performance zero-delay dragging state
  const [draggingNode, setDraggingNode] = useState<DraggingState | null>(null);
  const [activeDragPos, setActiveDragPos] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragRafRef = useRef<number | null>(null);

  // Blueprint Dragging and Wires
  const [wireConnecting, setWireConnecting] = useState<WireConnectingState | null>(null);
  const wireRafRef = useRef<number | null>(null);
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Hovered target node during wire drag
  const [hoveredTargetNodeId, setHoveredTargetNodeId] = useState<string | null>(null);

  // Selected Node for Detail Panel
  const [selectedNode, setSelectedNode] = useState<{
    type: NodeCategory;
    id: string;
  } | null>(null);

  // Right-Click Context Menu ("ให้คลิกขวาสร้างบล็อกได้จะมีแบบบุคคล เหตุการณ์ หรือ เอกสาร")
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    canvasX: 0,
    canvasY: 0,
  });
  const [contextSearch, setContextSearch] = useState<string>('');

  // Modals for Node Creation
  const [createModal, setCreateModal] = useState<{
    open: boolean;
    type: NodeCategory;
    canvasX: number;
    canvasY: number;
  } | null>(null);

  // AI Modal
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    type: string;
    url?: string;
  } | null>(null);

  // Common image attachment for new node creation
  const [newImageAttachment, setNewImageAttachment] = useState<string | undefined>(undefined);

  // Inline damage item input state per damage node
  const [newDamageItemInputs, setNewDamageItemInputs] = useState<
    Record<string, { label: string; amount: string }>
  >({});

  // Form states for creating new nodes via Context Menu
  // 1. Person
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('ลูกความ / โจทก์');
  const [newPersonPhone, setNewPersonPhone] = useState('');

  // 2. Event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('วันนี้');
  const [newEventDesc, setNewEventDesc] = useState('');

  // 3. Document
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState('สัญญา');
  const [newDocFile, setNewDocFile] = useState<{
    name: string;
    size: string;
    dataUrl?: string;
  } | null>(null);

  // 4. Legal Law
  const [newLawCode, setNewLawCode] = useState('ป.พ.พ. มาตรา 387');
  const [newLawTitle, setNewLawTitle] = useState('การบอกเลิกสัญญาเพราะผิดนัด');
  const [newLawDesc, setNewLawDesc] = useState(
    'เมื่อคู่สัญญาฝ่ายหนึ่งไม่ชำระหนี้ อีกฝ่ายมีสิทธิบอกเลิกสัญญาและเรียกค่าเสียหาย'
  );
  const [newLawElementsText, setNewLawElementsText] = useState(
    'มีนิติกรรมสัญญาที่สมบูรณ์\nคู่สัญญาฝ่ายหนึ่งผิดนัดไม่ชำระหนี้\nมีหนังสือบอกกล่าวให้เวลาพอสมควร\nพ้นกำหนดแล้วยังไม่ชำระหนี้'
  );

  // 5. Strategy
  const [newStratTitle, setNewStratTitle] = useState('');
  const [newStratSide, setNewStratSide] = useState<'opponent_defense' | 'our_claim'>('opponent_defense');
  const [newStratRisk, setNewStratRisk] = useState<'high' | 'medium' | 'low'>('medium');
  const [newStratArgument, setNewStratArgument] = useState('');
  const [newStratCounter, setNewStratCounter] = useState('');

  // 6. Damages
  const [newDmgTitle, setNewDmgTitle] = useState('บัญชีคำนวณยอดเงินเรียกร้องฟ้องคดี');
  const [newDmgItemLabel, setNewDmgItemLabel] = useState('เงินค่างวดที่จ่ายล่วงหน้า');
  const [newDmgItemAmount, setNewDmgItemAmount] = useState('500000');
  const [newDmgInterest, setNewDmgInterest] = useState('5');

  // 7. Lawyer Note
  const [newNoteTitle, setNewNoteTitle] = useState('📌 บันทึกยุทธวิธีว่าความ');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState<
    'amber' | 'purple' | 'blue' | 'rose' | 'emerald'
  >('amber');

  // Helper to resolve positions with activeDragPos override for zero-delay instant dragging
  const getNodePos = useCallback(
    (type: NodeCategory, id: string, index: number): NodePosition => {
      // Check active instant drag override
      if (activeDragPos && activeDragPos.id === id) {
        return { x: activeDragPos.x, y: activeDragPos.y };
      }

      if (type === 'case') {
        if (caseItem.x !== undefined && caseItem.y !== undefined) {
          return { x: caseItem.x, y: caseItem.y };
        }
        return { x: 440, y: 100 };
      }
      if (type === 'person') {
        const item = caseItem.people.find((p) => p.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        return { x: 80, y: 100 + index * 260 };
      }
      if (type === 'event') {
        const item = caseItem.events.find((e) => e.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        return { x: 440, y: 530 + index * 320 };
      }
      if (type === 'document') {
        const item = caseItem.documents.find((d) => d.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        return { x: 840, y: 100 + index * 270 };
      }
      if (type === 'law') {
        const item = (caseItem.legalLaws || []).find((l) => l.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        return { x: 1260, y: 100 + index * 390 };
      }
      if (type === 'strategy') {
        const item = (caseItem.strategies || []).find((s) => s.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        const pLen = caseItem.people.length || 2;
        const startY = Math.max(100 + pLen * 260 + 40, 520);
        return { x: 80, y: startY + index * 330 };
      }
      if (type === 'damages') {
        const item = (caseItem.damages || []).find((d) => d.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        const dLen = caseItem.documents.length || 3;
        return { x: 840, y: Math.max(100 + dLen * 270 + 40, 800) + index * 340 };
      }
      if (type === 'note') {
        const item = (caseItem.lawyerNotes || []).find((n) => n.id === id);
        if (item && item.x !== undefined && item.y !== undefined) {
          return { x: item.x, y: item.y };
        }
        const lLen = (caseItem.legalLaws || []).length || 1;
        return { x: 1260, y: Math.max(100 + lLen * 390 + 40, 800) + index * 310 };
      }
      return { x: 100, y: 100 };
    },
    [caseItem, activeDragPos]
  );

  // Helper to get matching theme colors for any node (used for wire dragging and custom connections)
  const getNodeColor = useCallback(
    (nodeId: string, nodeType?: NodeCategory): { main: string; light: string; glow: string } => {
      if (nodeType === 'person' || (!nodeType && caseItem.people.some((p) => p.id === nodeId))) {
        return { main: '#10b981', light: '#34d399', glow: '#059669' }; // Emerald
      }
      if (nodeType === 'document' || (!nodeType && caseItem.documents.some((d) => d.id === nodeId))) {
        return { main: '#f59e0b', light: '#fbbf24', glow: '#d97706' }; // Amber
      }
      if (nodeType === 'law' || (!nodeType && (caseItem.legalLaws || []).some((l) => l.id === nodeId))) {
        return { main: '#a855f7', light: '#c084fc', glow: '#9333ea' }; // Purple
      }
      if (nodeType === 'strategy' || (!nodeType && (caseItem.strategies || []).some((s) => s.id === nodeId))) {
        return { main: '#f43f5e', light: '#fb7185', glow: '#e11d48' }; // Rose
      }
      if (nodeType === 'damages' || (!nodeType && (caseItem.damages || []).some((d) => d.id === nodeId))) {
        return { main: '#eab308', light: '#fde047', glow: '#ca8a04' }; // Yellow
      }
      if (nodeType === 'note' || (!nodeType && (caseItem.lawyerNotes || []).some((n) => n.id === nodeId))) {
        return { main: '#f59e0b', light: '#fbbf24', glow: '#d97706' }; // Warm Amber
      }
      if (nodeType === 'event' || (!nodeType && caseItem.events.some((e) => e.id === nodeId))) {
        return { main: '#06b6d4', light: '#22d3ee', glow: '#0891b2' }; // Cyan
      }
      if (nodeType === 'case' || nodeId === caseItem.id) {
        return { main: '#6366f1', light: '#818cf8', glow: '#4f46e5' }; // Indigo
      }
      return { main: '#6366f1', light: '#818cf8', glow: '#4f46e5' };
    },
    [caseItem]
  );

  // Helper to find pin coordinates for custom connections with Left/Right pin resolution
  const getPinCoordinate = useCallback(
    (nodeId: string, side: 'in' | 'out' = 'out'): NodePosition | null => {
      let p: NodePosition | null = null;
      let width = 260;

      if (caseItem.id === nodeId) {
        p = getNodePos('case', caseItem.id, 0);
        width = 270;
      } else {
        const personIdx = caseItem.people.findIndex((item) => item.id === nodeId);
        if (personIdx !== -1) {
          p = getNodePos('person', nodeId, personIdx);
          width = 230;
        } else {
          const evIdx = caseItem.events.findIndex((e) => e.id === nodeId);
          if (evIdx !== -1) {
            p = getNodePos('event', nodeId, evIdx);
            width = 270;
          } else {
            const docIdx = caseItem.documents.findIndex((d) => d.id === nodeId);
            if (docIdx !== -1) {
              p = getNodePos('document', nodeId, docIdx);
              width = 270;
            } else {
              const lawIdx = (caseItem.legalLaws || []).findIndex((l) => l.id === nodeId);
              if (lawIdx !== -1) {
                p = getNodePos('law', nodeId, lawIdx);
                width = 300;
              } else {
                const stratIdx = (caseItem.strategies || []).findIndex((s) => s.id === nodeId);
                if (stratIdx !== -1) {
                  p = getNodePos('strategy', nodeId, stratIdx);
                  width = 290;
                } else {
                  const dmgIdx = (caseItem.damages || []).findIndex((d) => d.id === nodeId);
                  if (dmgIdx !== -1) {
                    p = getNodePos('damages', nodeId, dmgIdx);
                    width = 310;
                  } else {
                    const noteIdx = (caseItem.lawyerNotes || []).findIndex((n) => n.id === nodeId);
                    if (noteIdx !== -1) {
                      p = getNodePos('note', nodeId, noteIdx);
                      width = 290;
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (!p) return null;
      if (side === 'in') {
        return { x: p.x, y: p.y + 40 };
      }
      return { x: p.x + width, y: p.y + 40 };
    },
    [caseItem, getNodePos]
  );

  // FIX ZOOM BUG: Native non-passive Wheel listener to strictly prevent browser page zoom or page scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      // Strictly prevent browser page zoom and outer scrolling
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;

      setZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.25), 2.2);

        // Zoom centered around mouse cursor position
        setPan((prevPan) => {
          const canvasX = (mouseX - prevPan.x) / prevZoom;
          const canvasY = (mouseY - prevPan.y) / prevZoom;
          return {
            x: Math.round(mouseX - canvasX * nextZoom),
            y: Math.round(mouseY - canvasY * nextZoom),
          };
        });

        return nextZoom;
      });
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, []);

  // Prevent background scrolling when in Mind Map fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Fullscreen sync with Browser Fullscreen API
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard navigation, wire deletion & Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected wire via Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedWireId) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          removeCustomLink(caseItem.id, selectedWireId);
          setSelectedWireId(null);
        }
      }

      if (e.key === 'Escape') {
        if (selectedWireId) {
          setSelectedWireId(null);
        } else if (createModal?.open) {
          setCreateModal(null);
        } else if (contextMenu.visible) {
          setContextMenu((prev) => ({ ...prev, visible: false }));
        } else if (selectedNode) {
          setSelectedNode(null);
        } else if (isFullscreen) {
          toggleFullscreen();
        }
      }
      // F key toggles fullscreen if not typing
      if (e.key === 'f' || e.key === 'F') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          toggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, contextMenu.visible, createModal, selectedNode, selectedWireId, caseItem.id, removeCustomLink]);

  // ZERO-LAG WIRE DRAGGING: Listen to window events while dragging a wire
  useEffect(() => {
    if (!wireConnecting) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseCanvasX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseCanvasY = (e.clientY - rect.top - pan.y) / zoom;

      if (wireRafRef.current) cancelAnimationFrame(wireRafRef.current);
      wireRafRef.current = requestAnimationFrame(() => {
        setWireConnecting((prev) =>
          prev
            ? {
                ...prev,
                currentX: Math.round(mouseCanvasX),
                currentY: Math.round(mouseCanvasY),
              }
            : null
        );
      });
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
      // Check if dropped onto a node or pin
      const targetEl = (e.target as HTMLElement).closest('[data-node-id]');
      if (targetEl) {
        const targetId = targetEl.getAttribute('data-node-id');
        if (targetId && targetId !== wireConnecting.fromNodeId) {
          const sourceColor = wireConnecting.color || getNodeColor(wireConnecting.fromNodeId, wireConnecting.fromType).main;
          addCustomLink(caseItem.id, wireConnecting.fromNodeId, targetId, undefined, sourceColor);
        }
      }
      setWireConnecting(null);
      setHoveredTargetNodeId(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      if (wireRafRef.current) cancelAnimationFrame(wireRafRef.current);
    };
  }, [wireConnecting, pan.x, pan.y, zoom, caseItem.id, addCustomLink]);

  // Fullscreen Toggle using Browser API with fallback
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen ignored:', err);
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch (err) {
        console.warn('Exit fullscreen ignored:', err);
      }
    }
  };

  // Canvas Mouse Down: Start Pan or Close Context Menu
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If clicked on context menu, ignore
    if ((e.target as HTMLElement).closest('.blueprint-context-menu')) {
      return;
    }

    if (contextMenu.visible) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }

    // Track right mouse button for Unreal Engine drag-pan vs click
    if (e.button === 2) {
      rightClickDragRef.current = {
        isDown: true,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    }

    // Left click on empty canvas, middle click, or right click drag initiates pan
    if (e.button === 0 || e.button === 1 || e.button === 2) {
      // Check if clicking directly on a node
      if ((e.target as HTMLElement).closest('.blueprint-node')) {
        return;
      }
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  // Canvas Mouse Move: Dragging node, live wire, or panning
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Check right mouse movement distance
    if (rightClickDragRef.current.isDown) {
      const dist = Math.hypot(
        e.clientX - rightClickDragRef.current.startX,
        e.clientY - rightClickDragRef.current.startY
      );
      if (dist > 5) {
        rightClickDragRef.current.moved = true;
      }
    }

    // 1. Panning canvas
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    // 2. Dragging node (Zero-Delay Blueprint style using requestAnimationFrame)
    if (draggingNode) {
      const deltaX = (e.clientX - draggingNode.startX) / zoom;
      const deltaY = (e.clientY - draggingNode.startY) / zoom;
      const newX = Math.round(draggingNode.initialNodeX + deltaX);
      const newY = Math.round(draggingNode.initialNodeY + deltaY);

      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = requestAnimationFrame(() => {
        setActiveDragPos({ id: draggingNode.nodeId, x: newX, y: newY });
      });
      return;
    }

    // 3. Live Wire connection line
    if (wireConnecting && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseCanvasX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseCanvasY = (e.clientY - rect.top - pan.y) / zoom;
      setWireConnecting((prev) =>
        prev
          ? {
              ...prev,
              currentX: Math.round(mouseCanvasX),
              currentY: Math.round(mouseCanvasY),
            }
          : null
      );
    }
  };

  // Connect two nodes freely
  const handleConnectNodes = (targetNodeId: string) => {
    if (wireConnecting && wireConnecting.fromNodeId !== targetNodeId) {
      const sourceColor = wireConnecting.color || getNodeColor(wireConnecting.fromNodeId, wireConnecting.fromType).main;
      addCustomLink(caseItem.id, wireConnecting.fromNodeId, targetNodeId, undefined, sourceColor);
      setWireConnecting(null);
      setHoveredTargetNodeId(null);
    }
  };

  // Canvas Mouse Up
  const handleCanvasMouseUp = () => {
    rightClickDragRef.current.isDown = false;
    if (isPanning) setIsPanning(false);

    // Commit final node position only once on drop to eliminate all delay
    if (draggingNode && activeDragPos) {
      updateNodePosition(
        caseItem.id,
        draggingNode.nodeType,
        draggingNode.nodeId,
        activeDragPos.x,
        activeDragPos.y
      );
    }
    setDraggingNode(null);
    setActiveDragPos(null);
  };

  // Node Mouse Up - if user drops a wire anywhere on a node body, connect it!
  const handleNodeMouseUp = (nodeId: string) => {
    if (wireConnecting && wireConnecting.fromNodeId !== nodeId) {
      handleConnectNodes(nodeId);
    }
  };

  // Node Click - click-to-connect support
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    if (wireConnecting && wireConnecting.fromNodeId !== nodeId) {
      e.stopPropagation();
      handleConnectNodes(nodeId);
    }
  };

  // Right-click: Open Blueprint Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // If user dragged to pan with right click, do not open context menu
    if (rightClickDragRef.current.moved) {
      rightClickDragRef.current.moved = false;
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      canvasX: Math.round(canvasX),
      canvasY: Math.round(canvasY),
    });
    setContextSearch('');
  };

  // Node Drag Start
  const handleNodeMouseDown = (
    e: React.MouseEvent,
    type: NodeCategory,
    id: string,
    currentPos: NodePosition
  ) => {
    e.stopPropagation();
    // Do not drag if clicking input, button, or file upload
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('.interactive-action')
    ) {
      return;
    }

    // If currently wire connecting, this click connects to this node
    if (wireConnecting && wireConnecting.fromNodeId !== id) {
      handleConnectNodes(id);
      return;
    }

    setSelectedNode({ type, id });

    if (e.button === 0) {
      setDraggingNode({
        nodeId: id,
        nodeType: type,
        startX: e.clientX,
        startY: e.clientY,
        initialNodeX: currentPos.x,
        initialNodeY: currentPos.y,
      });
      setActiveDragPos({ id, x: currentPos.x, y: currentPos.y });
    }
  };

  // Wire Connection Pin Drag Start (supports both left 'in' and right 'out' pins)
  const handlePinMouseDown = (
    e: React.MouseEvent,
    fromNodeId: string,
    fromType: NodeCategory,
    pinX: number,
    pinY: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const sourceTheme = getNodeColor(fromNodeId, fromType);
    setWireConnecting({
      fromNodeId,
      fromType,
      fromX: pinX,
      fromY: pinY,
      currentX: pinX,
      currentY: pinY,
      color: sourceTheme.main,
    });
  };

  // Wire Connection Drop onto a Target Pin
  const handlePinMouseUp = (toNodeId: string, _toType?: NodeCategory) => {
    handleConnectNodes(toNodeId);
  };

  // Handle direct file attachment onto Document node
  const handleAttachFileToDoc = (
    e: React.ChangeEvent<HTMLInputElement>,
    docId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const targetDoc = caseItem.documents.find((d) => d.id === docId);
      if (targetDoc) {
        updateDocument(caseItem.id, {
          ...targetDoc,
          fileName: file.name,
          fileSize: sizeStr,
          fileDataUrl: uploadEvent.target?.result as string,
          status: 'กำลังตรวจ',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Create Node from Context Menu
  const handleOpenCreateModal = (type: NodeCategory) => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
    setCreateModal({
      open: true,
      type,
      canvasX: contextMenu.canvasX,
      canvasY: contextMenu.canvasY,
    });
    // Reset forms
    setNewPersonName('');
    setNewPersonRole('ลูกความ / โจทก์');
    setNewPersonPhone('');
    setNewEventTitle('');
    setNewEventDate('วันนี้');
    setNewEventDesc('');
    setNewDocTitle('');
    setNewDocType('สัญญา');
    setNewDocFile(null);
    setNewStratTitle('');
    setNewStratArgument('');
    setNewStratCounter('');
    setNewNoteContent('');
  };

  const handleSaveCreatedNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createModal) return;

    const { type, canvasX, canvasY } = createModal;

    if (type === 'person') {
      if (!newPersonName.trim()) return;
      addPerson(caseItem.id, {
        name: newPersonName.trim(),
        role: newPersonRole,
        phone: newPersonPhone.trim() || undefined,
        imageUrl: newImageAttachment,
        relatedEventIds: [],
        x: canvasX,
        y: canvasY,
      } as any);
    } else if (type === 'event') {
      if (!newEventTitle.trim()) return;
      addEvent(caseItem.id, {
        title: newEventTitle.trim(),
        date: newEventDate.trim() || 'ไม่ระบุวันที่',
        description: newEventDesc.trim() || 'ไม่มีรายละเอียด',
        imageUrl: newImageAttachment,
        relatedPersonNames: [],
        relatedDocNames: [],
        type: 'other',
        x: canvasX,
        y: canvasY,
      } as any);
    } else if (type === 'document') {
      if (!newDocTitle.trim()) return;
      addDocument(caseItem.id, {
        title: newDocTitle.trim(),
        type: newDocType,
        status: newDocFile ? 'กำลังตรวจ' : 'ยังไม่ได้ส่ง',
        date: 'วันนี้',
        fileName: newDocFile?.name,
        fileSize: newDocFile?.size,
        fileDataUrl: newDocFile?.dataUrl,
        imageUrl: newImageAttachment || (newDocFile?.dataUrl?.startsWith('data:image') ? newDocFile?.dataUrl : undefined),
        uploadedBy: 'ทนาย',
        relatedEventIds: [],
        x: canvasX,
        y: canvasY,
      } as any);
    } else if (type === 'law') {
      if (!newLawCode.trim()) return;
      const elements = newLawElementsText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text, i) => ({ id: `el-${Date.now()}-${i}`, text, satisfied: true }));

      addLegalLaw(caseItem.id, {
        code: newLawCode.trim(),
        title: newLawTitle.trim() || 'หลักกฎหมาย',
        description: newLawDesc.trim(),
        imageUrl: newImageAttachment,
        elements,
        x: canvasX,
        y: canvasY,
      });
    } else if (type === 'strategy') {
      if (!newStratTitle.trim()) return;
      addStrategy(caseItem.id, {
        title: newStratTitle.trim(),
        side: newStratSide,
        riskLevel: newStratRisk,
        keyArgument: newStratArgument.trim() || 'ข้อต่อสู้หลัก',
        counterPlan: newStratCounter.trim() || undefined,
        imageUrl: newImageAttachment,
        x: canvasX,
        y: canvasY,
      });
    } else if (type === 'damages') {
      if (!newDmgTitle.trim()) return;
      const amountNum = parseFloat(newDmgItemAmount.replace(/,/g, '')) || 0;
      addDamagesNode(caseItem.id, {
        title: newDmgTitle.trim(),
        imageUrl: newImageAttachment,
        items: [
          {
            id: `item-${Date.now()}`,
            label: newDmgItemLabel.trim() || 'รายการเรียกร้อง',
            amount: amountNum,
          },
        ],
        interestRate: parseFloat(newDmgInterest) || 5,
        x: canvasX,
        y: canvasY,
      });
    } else if (type === 'note') {
      if (!newNoteTitle.trim()) return;
      addLawyerNote(caseItem.id, {
        title: newNoteTitle.trim(),
        content: newNoteContent.trim() || 'ไม่มีข้อความ',
        color: newNoteColor,
        imageUrl: newImageAttachment,
        x: canvasX,
        y: canvasY,
      });
    }

    setNewImageAttachment(undefined);
    setCreateModal(null);
  };

  // Helper to get file icon
  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileText className="w-4 h-4 text-amber-400" />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileCode className="w-4 h-4 text-rose-400" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || ''))
      return <FileImage className="w-4 h-4 text-sky-400" />;
    return <File className="w-4 h-4 text-amber-400" />;
  };

  // Generate Orthogonal Stepped Path with Smooth Rounded Elbows ("เส้นตรงแบบหักโค้ง")
  const getOrthogonalPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    orientation: 'auto' | 'horizontal' | 'vertical' = 'auto',
    radius: number = 14
  ) => {
    const dx = endX - startX;
    const dy = endY - startY;

    // Detect if vertical flow (e.g. Case root down to Events, or Sequential Events)
    const isVertical =
      orientation === 'vertical' ||
      (orientation === 'auto' && Math.abs(dy) > Math.abs(dx) * 1.4);

    if (isVertical) {
      if (Math.abs(dx) < 6) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
      }
      const midY = startY + dy * 0.5;
      const r = Math.min(radius, Math.abs(dy) * 0.45, Math.abs(dx) * 0.45);
      const dirX = dx > 0 ? 1 : -1;
      const dirY = dy > 0 ? 1 : -1;

      return `M ${startX} ${startY} L ${startX} ${midY - dirY * r} Q ${startX} ${midY} ${startX + dirX * r} ${midY} L ${endX - dirX * r} ${midY} Q ${endX} ${midY} ${endX} ${midY + dirY * r} L ${endX} ${endY}`;
    }

    // Horizontal flow (Left/Right pin connectors)
    if (Math.abs(dy) < 6) {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    if (endX >= startX) {
      // Normal left to right stepped line with rounded corners
      const midX = startX + dx * 0.5;
      const r = Math.min(radius, Math.abs(dx) * 0.45, Math.abs(dy) * 0.45);
      const dirX = dx > 0 ? 1 : -1;
      const dirY = dy > 0 ? 1 : -1;

      return `M ${startX} ${startY} L ${midX - dirX * r} ${startY} Q ${midX} ${startY} ${midX} ${startY + dirY * r} L ${midX} ${endY - dirY * r} Q ${midX} ${endY} ${midX + dirX * r} ${endY} L ${endX} ${endY}`;
    } else {
      // Target is behind / to the left - loop around neatly
      const offset = 32;
      const midY = startY + dy * 0.5;
      const r = Math.min(radius, 12);
      const dirY = dy > 0 ? 1 : -1;

      return `M ${startX} ${startY} L ${startX + offset - r} ${startY} Q ${startX + offset} ${startY} ${startX + offset} ${startY + dirY * r} L ${startX + offset} ${midY - dirY * r} Q ${startX + offset} ${midY} ${startX + offset - r} ${midY} L ${endX - offset + r} ${midY} Q ${endX - offset} ${midY} ${endX - offset} ${endY - dirY * r} Q ${endX - offset} ${endY} ${endX - offset + r} ${endY} L ${endX} ${endY}`;
    }
  };

  // Wire rendering with Orthogonal Stepped ("เส้นตรงแบบหักโค้ง") & Bezier support
  const renderWire = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    strokeColor: string = '#6366f1',
    key: string = '',
    orientation: 'auto' | 'horizontal' | 'vertical' = 'auto',
    onDelete?: () => void,
    isSelected: boolean = false
  ) => {
    let d: string;
    if (lineStyle === 'orthogonal') {
      d = getOrthogonalPath(startX, startY, endX, endY, orientation, 14);
    } else {
      const dx = Math.max(Math.abs(endX - startX) * 0.5, 40);
      d = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
    }

    const midX = Math.round((startX + endX) / 2);
    const midY = Math.round((startY + endY) / 2);

    return (
      <g
        key={key}
        className={onDelete ? 'pointer-events-auto cursor-pointer group' : ''}
        onClick={(e) => {
          if (onDelete) {
            e.stopPropagation();
            setSelectedWireId(key);
          }
        }}
      >
        {/* Generous hit area for clicking */}
        {onDelete && (
          <path
            d={d}
            fill="none"
            stroke="transparent"
            strokeWidth="28"
            className="cursor-pointer"
          />
        )}

        {/* Glow backdrop */}
        <path
          d={d}
          fill="none"
          stroke={isSelected ? '#f43f5e' : strokeColor}
          strokeWidth={isSelected ? '8' : '5'}
          strokeOpacity={isSelected ? '0.45' : '0.22'}
          className="transition-all"
        />

        {/* Main wire cable */}
        <path
          d={d}
          fill="none"
          stroke={isSelected ? '#fb7185' : strokeColor}
          strokeWidth={isSelected ? '3.5' : '2.5'}
          strokeLinecap="round"
          className="transition-all"
        />

        {/* Connection flow dots */}
        <circle cx={startX} cy={startY} r="4" fill={isSelected ? '#fb7185' : strokeColor} />
        <circle cx={endX} cy={endY} r="4" fill={isSelected ? '#fb7185' : strokeColor} />

        {/* Delete button at midpoint */}
        {onDelete && (
          <g
            transform={`translate(${midX}, ${midY})`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer"
            style={{ pointerEvents: 'all' }}
          >
            <circle r="18" fill="transparent" />
            <circle
              r="11"
              fill={isSelected ? '#e11d48' : '#090d16'}
              stroke={isSelected ? '#ffffff' : strokeColor}
              strokeWidth="2"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
              pointerEvents="none"
            >
              ✕
            </text>
          </g>
        )}
      </g>
    );
  };

  // Backwards compatibility alias
  const renderBezierCurve = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    strokeColor: string = '#6366f1',
    key: string = '',
    orientation: 'auto' | 'horizontal' | 'vertical' = 'auto',
    onDelete?: () => void,
    isSelected: boolean = false
  ) => renderWire(startX, startY, endX, endY, strokeColor, key, orientation, onDelete, isSelected);

  // Case root position
  const casePos = getNodePos('case', caseItem.id, 0);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onContextMenu={handleContextMenu}
      className={`relative overflow-hidden select-none transition-all duration-300 w-full h-full ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-[#070b14]'
          : 'bg-[#070b14]'
      }`}
      style={{
        cursor: isPanning ? 'grabbing' : 'crosshair',
      }}
    >
      {/* 1. TOP HUD / TOOLBAR (Unreal Engine Blueprint style) */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 py-2.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Branding & Blueprint Stats */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-bold text-white tracking-wide uppercase font-mono text-[11px] text-sky-400">
              CASELINK // BLUEPRINT GRAPH
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
            <span className="text-cyan-400 font-semibold">{caseItem.events.length} เหตุการณ์</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{caseItem.people.length} บุคคล</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{caseItem.documents.length} เอกสาร</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">
              {(caseItem.legalLaws || []).length} ข้อกฎหมาย
            </span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">
              {(caseItem.strategies || []).length} กลยุทธ์
            </span>
          </div>

          {/* Quick Help Tip */}
          <span className="hidden xl:inline text-[11px] text-slate-400 italic">
            💡 เลื่อน Wheel เพื่อซูมเฉพาะกราฟ | คลิกขวาบนพื้นที่ว่างเพื่อเพิ่มบล็อกทนาย
          </span>
        </div>

        {/* Right: Actions & Viewport Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Add Node button (for users who prefer button over right-click) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              setContextMenu({
                visible: true,
                x: rect.left + 80,
                y: rect.top + 70,
                canvasX: Math.round((-pan.x + 300) / zoom),
                canvasY: Math.round((-pan.y + 200) / zoom),
              });
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>+ เพิ่มบล็อก</span>
          </button>

          {/* AI Auto-Layout Button ("มี Ai จัดระเบียบให้ Mind map เพื่อไม่ให้มันมั่ว") */}
          <button
            onClick={() => {
              autoOrganizeMindMap(caseItem.id);
              setPan({ x: 80, y: 40 });
              setZoom(0.92);
              setOrganizeToast('✨ AI จัดระเบียบผังคดีและเรียงเส้นตรงหักโค้งเรียบร้อยแล้ว');
              setTimeout(() => setOrganizeToast(null), 3500);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
            title="จัดระเบียบ Mind Map ด้วย AI อัตโนมัติ ป้องกันบล็อกและเส้นเชื่อมซ้อนทับกัน"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>✨ AI จัดระเบียบผัง</span>
          </button>

          {/* Line Style Toggle ("ให้เป็นเส้นตรงแบบหักโค้งแทน") */}
          <button
            onClick={() => setLineStyle(lineStyle === 'orthogonal' ? 'bezier' : 'orthogonal')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            title="สลับรูปแบบเส้นเชื่อม: เส้นตรงหักโค้ง (แนะนำ) หรือ เส้นโค้ง Bezier"
          >
            {lineStyle === 'orthogonal' ? (
              <span className="text-emerald-400 font-bold">📐 เส้นตรงหักโค้ง</span>
            ) : (
              <span className="text-sky-400">〰️ เส้นโค้ง Bezier</span>
            )}
          </button>

          {/* Restore hidden default links if any */}
          {caseItem.hiddenDefaultLinks && caseItem.hiddenDefaultLinks.length > 0 && (
            <button
              onClick={() => restoreAllDefaultLinks(caseItem.id)}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs flex items-center space-x-1 transition cursor-pointer"
              title="กู้คืนเส้นเชื่อมเริ่มต้นที่ถูกซ่อน"
            >
              <RotateCcw className="w-3 h-3" />
              <span>กู้เส้น ({caseItem.hiddenDefaultLinks.length})</span>
            </button>
          )}

          {/* AI Structuring Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ จัดโครงสร้างด้วย AI</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.25))}
              className="p-1 text-slate-400 hover:text-white"
              title="ซูมออก"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1 min-w-[38px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.2))}
              className="p-1 text-slate-400 hover:text-white"
              title="ซูมเข้า"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-slate-400 hover:text-white border-l border-slate-800"
              title="รีเซ็ตมุมมอง"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle ("ให้เป็น Full Screen สำหรับ หน้า Mind Map เลย") */}
          <button
            onClick={toggleFullscreen}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              isFullscreen
                ? 'bg-rose-950/90 border-rose-700 text-rose-300 hover:bg-rose-900'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
            title={isFullscreen ? 'ย่อหน้าต่าง (Esc)' : 'ขยายเต็มหน้าจอ (F)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>ย่อหน้าต่าง (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>เต็มหน้าจอ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Organization Feedback Toast */}
      {organizeToast && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-40 bg-emerald-950/95 text-emerald-200 px-4 py-2 rounded-2xl border border-emerald-500/80 shadow-2xl backdrop-blur-md animate-in fade-in flex items-center space-x-2 text-xs font-bold pointer-events-none">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{organizeToast}</span>
        </div>
      )}

      {/* 2. INFINITE BLUEPRINT CANVAS */}
      <div
        className="w-full h-full relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Unreal Engine Blueprint Grid Overlay */}
        <div
          className="absolute -top-[5000px] -left-[5000px] w-[15000px] h-[15000px] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 255, 255, 0.09) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.09) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
          }}
        />

        {/* SVG LAYER: Curved Bezier Wires */}
        <svg className="absolute -top-[5000px] -left-[5000px] w-[15000px] h-[15000px] pointer-events-none overflow-visible">
          <g transform="translate(5000, 5000)">
            {/* Wire 1: Case -> First Event */}
            {caseItem.events.length > 0 &&
              !caseItem.hiddenDefaultLinks?.includes('case-event-first') &&
              renderBezierCurve(
                casePos.x + 130,
                casePos.y + 110,
                getNodePos('event', caseItem.events[0].id, 0).x + 130,
                getNodePos('event', caseItem.events[0].id, 0).y,
                '#6366f1',
                'case-event-first',
                'vertical',
                () => hideDefaultLink(caseItem.id, 'case-event-first'),
                selectedWireId === 'case-event-first'
              )}

            {/* Wire 2: Case -> People */}
            {caseItem.people.slice(0, 3).map((p, idx) => {
              const linkKey = `case-person-${p.id || idx}-${idx}`;
              if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
              const pos = getNodePos('person', p.id, idx);
              return renderBezierCurve(
                casePos.x,
                casePos.y + 40 + idx * 20,
                pos.x + 200,
                pos.y + 40,
                '#10b981',
                linkKey,
                'horizontal',
                () => hideDefaultLink(caseItem.id, linkKey),
                selectedWireId === linkKey
              );
            })}

            {/* Wire 3: Sequential Events (ทำสัญญา -> ผิดสัญญา -> แจ้งเตือน -> ยื่นฟ้อง) */}
            {caseItem.events.map((ev, idx) => {
              if (idx < caseItem.events.length - 1) {
                const linkKey = `ev-flow-${ev.id || idx}-${idx}`;
                if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
                const curPos = getNodePos('event', ev.id, idx);
                const nextPos = getNodePos('event', caseItem.events[idx + 1].id, idx + 1);
                return renderBezierCurve(
                  curPos.x + 130,
                  curPos.y + 115,
                  nextPos.x + 130,
                  nextPos.y,
                  '#06b6d4',
                  linkKey,
                  'vertical',
                  () => hideDefaultLink(caseItem.id, linkKey),
                  selectedWireId === linkKey
                );
              }
              return null;
            })}

            {/* Wire 4: Events -> Related Documents */}
            {caseItem.documents.map((doc, idx) => {
              const linkKey = `doc-wire-${doc.id || idx}-${idx}`;
              if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
              const docPos = getNodePos('document', doc.id, idx);
              const relatedEv = caseItem.events[idx % caseItem.events.length];
              const evPos = relatedEv ? getNodePos('event', relatedEv.id, 0) : casePos;
              return renderBezierCurve(
                evPos.x + 260,
                evPos.y + 50,
                docPos.x,
                docPos.y + 45,
                '#f59e0b',
                linkKey,
                'horizontal',
                () => hideDefaultLink(caseItem.id, linkKey),
                selectedWireId === linkKey
              );
            })}

            {/* Wire 5: Events -> Legal Laws */}
            {(caseItem.legalLaws || []).map((law, idx) => {
              const linkKey = `law-wire-${law.id || idx}-${idx}`;
              if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
              const lawPos = getNodePos('law', law.id, idx);
              const targetEv = caseItem.events[1] || caseItem.events[0];
              const evPos = targetEv ? getNodePos('event', targetEv.id, 1) : casePos;
              return renderBezierCurve(
                evPos.x + 130,
                evPos.y + 115,
                lawPos.x + 140,
                lawPos.y,
                '#a855f7',
                linkKey,
                'horizontal',
                () => hideDefaultLink(caseItem.id, linkKey),
                selectedWireId === linkKey
              );
            })}

            {/* Wire 6: Events -> Strategies */}
            {(caseItem.strategies || []).map((strat, idx) => {
              const linkKey = `strat-wire-${strat.id || idx}-${idx}`;
              if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
              const stratPos = getNodePos('strategy', strat.id, idx);
              const targetEv = caseItem.events[idx % caseItem.events.length] || caseItem.events[0];
              const evPos = targetEv ? getNodePos('event', targetEv.id, idx) : casePos;
              return renderBezierCurve(
                evPos.x,
                evPos.y + 50,
                stratPos.x + 280,
                stratPos.y + 45,
                '#f43f5e',
                linkKey,
                'horizontal',
                () => hideDefaultLink(caseItem.id, linkKey),
                selectedWireId === linkKey
              );
            })}

            {/* Wire 7: Damages -> Case Root */}
            {(caseItem.damages || []).map((dmg, idx) => {
              const linkKey = `dmg-wire-${dmg.id || idx}-${idx}`;
              if (caseItem.hiddenDefaultLinks?.includes(linkKey)) return null;
              const dmgPos = getNodePos('damages', dmg.id, idx);
              return renderBezierCurve(
                casePos.x + 260,
                casePos.y + 60,
                dmgPos.x,
                dmgPos.y + 50,
                '#eab308',
                linkKey,
                'horizontal',
                () => hideDefaultLink(caseItem.id, linkKey),
                selectedWireId === linkKey
              );
            })}

            {/* Wire 8: Custom Connections created by User (Freely connecting any nodes) */}
            {caseItem.customLinks?.map((link, idx) => {
              const defaultFrom = getPinCoordinate(link.fromId, 'out');
              const defaultTo = getPinCoordinate(link.toId, 'in');
              if (!defaultFrom || !defaultTo) return null;

              // Check if target node is situated to the left of source node
              const isTargetLeft = defaultTo.x < defaultFrom.x - 40;
              const fromPos = isTargetLeft ? getPinCoordinate(link.fromId, 'in') || defaultFrom : defaultFrom;
              const toPos = isTargetLeft ? getPinCoordinate(link.toId, 'out') || defaultTo : defaultTo;

              const midX = Math.round((fromPos.x + toPos.x) / 2);
              const midY = Math.round((fromPos.y + toPos.y) / 2);
              const isSelected = selectedWireId === link.id;
              const isHovered = hoveredWireId === link.id;

              const wireColor = link.color
                ? { main: link.color, light: link.color, glow: link.color }
                : getNodeColor(link.fromId);
              const dx = Math.max(Math.abs(toPos.x - fromPos.x) * 0.5, 40);
              const d =
                lineStyle === 'orthogonal'
                  ? getOrthogonalPath(fromPos.x, fromPos.y, toPos.x, toPos.y, 'horizontal', 14)
                  : `M ${fromPos.x} ${fromPos.y} C ${fromPos.x + dx} ${fromPos.y}, ${toPos.x - dx} ${toPos.y}, ${toPos.x} ${toPos.y}`;

              return (
                <g
                  key={`custom-wire-${link.id || idx}-${idx}`}
                  className="pointer-events-auto"
                  onMouseEnter={() => setHoveredWireId(link.id)}
                  onMouseLeave={() => setHoveredWireId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWireId(link.id);
                  }}
                >
                  {/* Wide invisible hit area for easy hover/selection along the wire */}
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="28"
                    className="cursor-pointer"
                  />

                  {/* Wire glow */}
                  <path
                    d={d}
                    fill="none"
                    stroke={isSelected ? '#f43f5e' : isHovered ? wireColor.light : wireColor.glow}
                    strokeWidth={isSelected ? '8' : isHovered ? '6' : '4'}
                    strokeOpacity={isSelected ? '0.45' : isHovered ? '0.35' : '0.22'}
                  />

                  {/* Main wire cable */}
                  <path
                    d={d}
                    fill="none"
                    stroke={isSelected ? '#fb7185' : isHovered ? '#ffffff' : wireColor.main}
                    strokeWidth={isSelected ? '3.5' : isHovered ? '3' : '2.5'}
                    strokeLinecap="round"
                  />

                  {/* End connection pins */}
                  <circle cx={fromPos.x} cy={fromPos.y} r="4.5" fill={isSelected ? '#fb7185' : wireColor.main} />
                  <circle cx={toPos.x} cy={toPos.y} r="4.5" fill={isSelected ? '#fb7185' : wireColor.main} />

                  {/* STABLE Delete button at midpoint */}
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomLink(caseItem.id, link.id);
                      if (selectedWireId === link.id) setSelectedWireId(null);
                      if (hoveredWireId === link.id) setHoveredWireId(null);
                    }}
                    className="cursor-pointer"
                    style={{ pointerEvents: 'all' }}
                  >
                    {/* Generous invisible touch target */}
                    <circle r="18" fill="transparent" />

                    {/* Button circle background with source node color */}
                    <circle
                      r="11"
                      fill={isHovered || isSelected ? '#e11d48' : '#090d16'}
                      stroke={isHovered || isSelected ? '#ffffff' : wireColor.main}
                      strokeWidth="2"
                    />

                    {/* Centered delete X */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      ✕
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Live Interactive Wire when User drags from a Pin */}
            {wireConnecting && (() => {
              const activeColor = wireConnecting.color
                ? { main: wireConnecting.color, light: wireConnecting.color, glow: wireConnecting.color }
                : getNodeColor(wireConnecting.fromNodeId, wireConnecting.fromType);
              return renderBezierCurve(
                wireConnecting.fromX,
                wireConnecting.fromY,
                wireConnecting.currentX,
                wireConnecting.currentY,
                activeColor.main,
                'active-drag-wire',
                'horizontal'
              );
            })()}
          </g>
        </svg>

        {/* Floating HTML Delete Action Pill for Selected Custom Wire */}
        {selectedWireId && (() => {
          const customLink = caseItem.customLinks?.find((l) => l.id === selectedWireId);
          if (customLink) {
            const from = getPinCoordinate(customLink.fromId, 'out') || getPinCoordinate(customLink.fromId, 'in');
            const to = getPinCoordinate(customLink.toId, 'in') || getPinCoordinate(customLink.toId, 'out');
            if (from && to) {
              const mx = Math.round((from.x + to.x) / 2);
              const my = Math.round((from.y + to.y) / 2);
              return (
                <div
                  className="absolute z-50 transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/95 text-white px-3.5 py-2 rounded-2xl border border-rose-500/80 shadow-2xl flex items-center space-x-2.5 backdrop-blur-md animate-in fade-in pointer-events-auto"
                  style={{ left: mx, top: my - 12 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] font-semibold text-slate-300">🔗 เส้นเชื่อม</span>
                  <button
                    type="button"
                    onClick={() => {
                      removeCustomLink(caseItem.id, customLink.id);
                      setSelectedWireId(null);
                      setHoveredWireId(null);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบเส้นเชื่อมนี้</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWireId(null)}
                    className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            }
          }
          return null;
        })()}

        {/* 3. BLUEPRINT NODES */}

        {/* NODE TYPE 0: ROOT CASE NODE (Purple Blueprint) */}
        <div
          data-node-id={caseItem.id}
          onMouseDown={(e) => handleNodeMouseDown(e, 'case', caseItem.id, casePos)}
          onMouseUp={() => handleNodeMouseUp(caseItem.id)}
          onClick={(e) => handleNodeClick(e, caseItem.id)}
          style={{
            transform: `translate(${casePos.x}px, ${casePos.y}px)`,
            boxShadow: wireConnecting && wireConnecting.fromNodeId !== caseItem.id ? `0 0 0 3.5px ${wireConnecting.color || '#38bdf8'}` : undefined,
          }}
          className={`blueprint-node absolute w-[270px] rounded-xl bg-slate-900/95 border-2 shadow-2xl transition-shadow duration-150 cursor-grab active:cursor-grabbing ${
            selectedNode?.type === 'case'
              ? 'border-indigo-400 ring-4 ring-indigo-500/20'
              : 'border-indigo-600/70 hover:border-indigo-400'
          }`}
        >
          {/* Node Header */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-t-lg border-b border-indigo-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-bold text-[10px] text-white">
                C
              </span>
              <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                CASE ROOT
              </span>
            </div>
            <span className="text-[10px] bg-indigo-950/80 text-sky-300 font-semibold px-2 py-0.5 rounded border border-indigo-800">
              {caseItem.type}
            </span>
          </div>

          {/* Node Body */}
          <div className="p-3.5 space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-100 leading-snug">
              {caseItem.title}
            </h3>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>สถานะ: 🟡 {caseItem.status}</span>
              <span className="font-mono text-slate-300">{caseItem.deadline}</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              {caseItem.description}
            </p>

            {/* Image Slot for Case */}
            <BlueprintImageSlot
              imageUrl={caseItem.imageUrl}
              onUpdateImage={(url) => updateNodeImage(caseItem.id, 'case', caseItem.id, url)}
              onPreview={(url) =>
                setPreviewFile({
                  name: `ภาพหน้าสำนวนคดี: ${caseItem.title}`,
                  type: 'รูปภาพคดี',
                  url,
                })
              }
              label="ภาพประกอบคดี"
            />
          </div>

          {/* Left Input Pin */}
          <div
            onMouseDown={(e) => handlePinMouseDown(e, caseItem.id, 'case', casePos.x, casePos.y + 40)}
            onMouseUp={() => handlePinMouseUp(caseItem.id, 'case')}
            title="พอร์ตเชื่อมโยง (Input)"
            className="absolute -left-2 top-10 w-4 h-4 rounded-full border-2 border-indigo-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
          />

          {/* Right Output Pin */}
          <div
            onMouseDown={(e) => handlePinMouseDown(e, caseItem.id, 'case', casePos.x + 270, casePos.y + 40)}
            onMouseUp={() => handlePinMouseUp(caseItem.id, 'case')}
            title="พอร์ตเชื่อมโยง (Output)"
            className="absolute -right-2 top-10 w-4 h-4 rounded-full border-2 border-indigo-400 bg-indigo-600 hover:scale-125 transition-transform cursor-pointer"
          />

          {/* Bottom Execution Pin */}
          <div className="pb-2.5 px-3 flex justify-between items-center text-[10px] text-indigo-300 border-t border-slate-800/60 pt-2 font-mono">
            <span>ลำดับคดี</span>
            <div
              onMouseDown={(e) =>
                handlePinMouseDown(e, caseItem.id, 'case', casePos.x + 135, casePos.y + 115)
              }
              onMouseUp={() => handlePinMouseUp(caseItem.id, 'case')}
              title="ลากเส้นเชื่อมโยง"
              className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 bg-indigo-600 hover:scale-125 transition-transform cursor-pointer"
            />
          </div>
        </div>

        {/* NODE TYPE 1: บุคคล (Person Nodes - Emerald Green Blueprint) */}
        {caseItem.people.map((person, index) => {
          const pos = getNodePos('person', person.id, index);
          const isSelected = selectedNode?.type === 'person' && selectedNode.id === person.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== person.id;

          return (
            <div
              key={`node-person-${person.id || index}-${index}`}
              data-node-id={person.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'person', person.id, pos)}
              onMouseUp={() => handleNodeMouseUp(person.id)}
              onClick={(e) => handleNodeClick(e, person.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[230px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-emerald-400 ring-4 ring-emerald-500/20'
                  : 'border-emerald-700/60 hover:border-emerald-400'
              }`}
            >
              <div className="px-3 py-2 bg-gradient-to-r from-emerald-900/90 to-slate-900 rounded-t-lg border-b border-emerald-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono">
                    PERSON
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`ลบบุคคล "${person.name}" หรือไม่?`)) {
                      deletePerson(caseItem.id, person.id);
                    }
                  }}
                  className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="ลบบุคคล"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 space-y-1.5 text-xs">
                <div className="font-bold text-slate-100">{person.name}</div>
                <div className="inline-block text-[10px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-800">
                  {person.role}
                </div>
                {person.phone && (
                  <div className="text-[10px] text-slate-400 font-mono">{person.phone}</div>
                )}

                {/* Image Slot for Person */}
                <BlueprintImageSlot
                  imageUrl={person.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'person', person.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `ภาพบุคคล: ${person.name}`,
                      type: 'ภาพบุคคล/พยาน',
                      url,
                    })
                  }
                  label={person.name}
                />
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, person.id, 'person', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(person.id, 'person')}
                className="absolute -left-2 top-8 w-4 h-4 rounded-full border-2 border-emerald-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, person.id, 'person', pos.x + 230, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(person.id, 'person')}
                className="absolute -right-2 top-8 w-4 h-4 rounded-full border-2 border-emerald-400 bg-emerald-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}

        {/* NODE TYPE 2: เหตุการณ์ (Event Nodes - Cyan Electric Blue Blueprint) */}
        {caseItem.events.map((ev, index) => {
          const pos = getNodePos('event', ev.id, index);
          const isSelected = selectedNode?.type === 'event' && selectedNode.id === ev.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== ev.id;

          return (
            <div
              key={`node-event-${ev.id || index}-${index}`}
              data-node-id={ev.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'event', ev.id, pos)}
              onMouseUp={() => handleNodeMouseUp(ev.id)}
              onClick={(e) => handleNodeClick(e, ev.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[270px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-cyan-400 ring-4 ring-cyan-500/20'
                  : 'border-cyan-700/60 hover:border-cyan-400'
              }`}
            >
              <div className="px-3 py-2 bg-gradient-to-r from-cyan-950 via-blue-900 to-slate-900 rounded-t-lg border-b border-cyan-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono">
                    EVENT #{index + 1}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                    {ev.date}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`ลบเหตุการณ์ "${ev.title}" หรือไม่?`)) {
                        deleteEvent(caseItem.id, ev.id);
                      }
                    }}
                    className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded ml-1 cursor-pointer"
                    title="ลบเหตุการณ์"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-100">{ev.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                  {ev.description}
                </p>

                {ev.relatedPersonNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {ev.relatedPersonNames.map((p, i) => (
                      <span
                        key={i}
                        className="text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image Slot for Event */}
                <BlueprintImageSlot
                  imageUrl={ev.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'event', ev.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `ภาพเหตุการณ์: ${ev.title}`,
                      type: 'ภาพถ่ายเหตุการณ์',
                      url,
                    })
                  }
                  label={ev.title}
                />
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, ev.id, 'event', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(ev.id, 'event')}
                className="absolute -left-2 top-10 w-4 h-4 rounded-full border-2 border-cyan-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, ev.id, 'event', pos.x + 270, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(ev.id, 'event')}
                className="absolute -right-2 top-10 w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />

              {/* Top Sequence Input */}
              <div
                onMouseUp={() => handlePinMouseUp(ev.id, 'event')}
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="รับลำดับเวลา"
              />

              {/* Bottom Sequence Output */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, ev.id, 'event', pos.x + 135, pos.y + 115)
                }
                onMouseUp={() => handlePinMouseUp(ev.id, 'event')}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-600 hover:scale-125 transition-transform cursor-pointer"
                title="ส่งต่อลำดับเวลา"
              />
            </div>
          );
        })}

        {/* NODE TYPE 3: เอกสารและหลักฐาน (Document Nodes - Amber/Orange Blueprint with Direct File Attachment) */}
        {caseItem.documents.map((doc, index) => {
          const pos = getNodePos('document', doc.id, index);
          const isSelected = selectedNode?.type === 'document' && selectedNode.id === doc.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== doc.id;

          return (
            <div
              key={`node-doc-${doc.id || index}-${index}`}
              data-node-id={doc.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'document', doc.id, pos)}
              onMouseUp={() => handleNodeMouseUp(doc.id)}
              onClick={(e) => handleNodeClick(e, doc.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[270px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-amber-400 ring-4 ring-amber-500/20'
                  : 'border-amber-700/60 hover:border-amber-400'
              }`}
            >
              <div className="px-3 py-2 bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 rounded-t-lg border-b border-amber-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono">
                    DOCUMENT
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                    {doc.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`ลบเอกสาร "${doc.title}" หรือไม่?`)) {
                        deleteDocument(caseItem.id, doc.id);
                      }
                    }}
                    className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded ml-1 cursor-pointer"
                    title="ลบเอกสาร"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-100">{doc.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>{doc.date}</span>
                    <span className="text-emerald-400 font-semibold">{doc.status}</span>
                  </div>
                </div>

                {/* Direct file attachment box */}
                <div className="interactive-action bg-slate-950/80 p-2 rounded-lg border border-slate-800/90 text-xs space-y-1.5">
                  {doc.fileName || doc.fileDataUrl ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 overflow-hidden mr-2">
                        {getFileIcon(doc.fileName)}
                        <div className="truncate">
                          <div className="font-semibold text-slate-200 text-[11px] truncate">
                            {doc.fileName || 'ไฟล์เอกสารแนบ'}
                          </div>
                          <div className="text-[10px] text-slate-400">{doc.fileSize || 'แนบแล้ว'}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {doc.fileDataUrl && (
                          <button
                            onClick={() =>
                              setPreviewFile({
                                name: doc.fileName || doc.title,
                                type: doc.type,
                                url: doc.fileDataUrl,
                              })
                            }
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 cursor-pointer"
                            title="เปิดดูไฟล์"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <label
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="เปลี่ยนไฟล์"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleAttachFileToDoc(e, doc.id)}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full py-1.5 px-2 bg-amber-950/40 hover:bg-amber-900/50 border border-dashed border-amber-600/70 hover:border-amber-400 rounded-md text-[11px] font-semibold text-amber-300 flex items-center justify-center space-x-1.5 cursor-pointer transition">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>+ แนบไฟล์เอกสาร (PDF/รูป)</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleAttachFileToDoc(e, doc.id)}
                      />
                    </label>
                  )}
                </div>

                {/* Image Slot for Document */}
                <BlueprintImageSlot
                  imageUrl={doc.imageUrl || (doc.fileDataUrl && doc.fileDataUrl.startsWith('data:image') ? doc.fileDataUrl : undefined)}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'document', doc.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `ภาพเอกสาร: ${doc.title}`,
                      type: 'ภาพเอกสาร/หลักฐาน',
                      url,
                    })
                  }
                  label={doc.title}
                />
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, doc.id, 'document', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(doc.id, 'document')}
                className="absolute -left-2 top-10 w-4 h-4 rounded-full border-2 border-amber-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, doc.id, 'document', pos.x + 270, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(doc.id, 'document')}
                className="absolute -right-2 top-10 w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}

        {/* NODE TYPE 4: ข้อกฎหมายและมาตรา (Legal Statute & Claim Nodes - Deep Violet Blueprint) */}
        {(caseItem.legalLaws || []).map((law, index) => {
          const pos = getNodePos('law', law.id, index);
          const isSelected = selectedNode?.type === 'law' && selectedNode.id === law.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== law.id;
          const satisfiedCount = law.elements.filter((e) => e.satisfied).length;
          const isComplete = law.elements.length > 0 && satisfiedCount === law.elements.length;

          return (
            <div
              key={`node-law-${law.id || index}-${index}`}
              data-node-id={law.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'law', law.id, pos)}
              onMouseUp={() => handleNodeMouseUp(law.id)}
              onClick={(e) => handleNodeClick(e, law.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[300px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-purple-400 ring-4 ring-purple-500/20'
                  : 'border-purple-700/60 hover:border-purple-400'
              }`}
            >
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 rounded-t-lg border-b border-purple-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono tracking-wider">
                    STATUTE // ข้อกฎหมาย
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`ลบข้อกฎหมาย "${law.code}" หรือไม่?`)) {
                      deleteLegalLaw(caseItem.id, law.id);
                    }
                  }}
                  className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="ลบข้อกฎหมายนี้"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3.5 space-y-2.5 text-xs">
                <div>
                  <div className="inline-block text-[11px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                    {law.code}
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs mt-1">{law.title}</h4>
                  {law.description && (
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {law.description}
                    </p>
                  )}
                </div>

                {/* Image Slot for Law */}
                <BlueprintImageSlot
                  imageUrl={law.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'law', law.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `ข้อกฎหมาย: ${law.code}`,
                      type: 'ภาพประกอบข้อกฎหมาย',
                      url,
                    })
                  }
                  label={law.code}
                />

                {/* Elements Checklist with interactive toggle */}
                <div className="interactive-action bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-300">องค์ประกอบความรับผิด:</span>
                    <span
                      className={`font-mono px-1.5 py-0.5 rounded ${
                        isComplete
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {satisfiedCount}/{law.elements.length} ครบถ้วน
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {law.elements.map((el) => (
                      <div
                        key={el.id}
                        onClick={() => toggleLawElement(caseItem.id, law.id, el.id)}
                        className="flex items-start space-x-1.5 p-1 rounded hover:bg-slate-900 cursor-pointer text-[11px] transition"
                      >
                        {el.satisfied ? (
                          <CheckSquare2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={el.satisfied ? 'text-slate-200' : 'text-slate-400 line-through'}
                        >
                          {el.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, law.id, 'law', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(law.id, 'law')}
                className="absolute -left-2 top-8 w-4 h-4 rounded-full border-2 border-purple-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, law.id, 'law', pos.x + 300, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(law.id, 'law')}
                className="absolute -right-2 top-8 w-4 h-4 rounded-full border-2 border-purple-400 bg-purple-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}

        {/* NODE TYPE 5: ข้อต่อสู้และกลยุทธ์คดี (Defense Strategy Nodes - Crimson/Rose Blueprint) */}
        {(caseItem.strategies || []).map((strat, index) => {
          const pos = getNodePos('strategy', strat.id, index);
          const isSelected = selectedNode?.type === 'strategy' && selectedNode.id === strat.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== strat.id;

          return (
            <div
              key={`node-strat-${strat.id || index}-${index}`}
              data-node-id={strat.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'strategy', strat.id, pos)}
              onMouseUp={() => handleNodeMouseUp(strat.id)}
              onClick={(e) => handleNodeClick(e, strat.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[290px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-rose-400 ring-4 ring-rose-500/20'
                  : 'border-rose-700/60 hover:border-rose-400'
              }`}
            >
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 rounded-t-lg border-b border-rose-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono tracking-wider">
                    STRATEGY // กลยุทธ์
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`ลบกลยุทธ์ "${strat.title}" หรือไม่?`)) {
                      deleteStrategy(caseItem.id, strat.id);
                    }
                  }}
                  className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="ลบกลยุทธ์นี้"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                      strat.side === 'opponent_defense'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-sky-950 text-sky-300 border-sky-800'
                    }`}
                  >
                    {strat.side === 'opponent_defense'
                      ? 'จำเลยอาจยกขึ้นต่อสู้'
                      : 'ประเด็นรุกฝ่ายโจทก์'}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      strat.riskLevel === 'high'
                        ? 'text-red-400 bg-red-950/80 border border-red-800'
                        : strat.riskLevel === 'medium'
                        ? 'text-amber-400 bg-amber-950/80 border border-amber-800'
                        : 'text-emerald-400 bg-emerald-950/80 border border-emerald-800'
                    }`}
                  >
                    {strat.riskLevel === 'high'
                      ? 'เสี่ยงสูง'
                      : strat.riskLevel === 'medium'
                      ? 'เสี่ยงปานกลาง'
                      : 'เสี่ยงต่ำ'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-xs">{strat.title}</h4>
                <p className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                  {strat.keyArgument}
                </p>

                {strat.counterPlan && (
                  <div className="text-[11px] bg-rose-950/30 border border-rose-900/50 p-2 rounded-lg text-rose-200">
                    <span className="font-bold text-rose-300">แนวทางซักค้าน/แก้ต่าง: </span>
                    {strat.counterPlan}
                  </div>
                )}

                {/* Image Slot for Strategy */}
                <BlueprintImageSlot
                  imageUrl={strat.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'strategy', strat.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `กลยุทธ์: ${strat.title}`,
                      type: 'ภาพกลยุทธ์/หลักฐานสืบพยาน',
                      url,
                    })
                  }
                  label={strat.title}
                />
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, strat.id, 'strategy', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(strat.id, 'strategy')}
                className="absolute -left-2 top-8 w-4 h-4 rounded-full border-2 border-rose-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, strat.id, 'strategy', pos.x + 290, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(strat.id, 'strategy')}
                className="absolute -right-2 top-8 w-4 h-4 rounded-full border-2 border-rose-400 bg-rose-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}

        {/* NODE TYPE 6: คำนวณค่าเสียหายและรายการเรียกร้อง (Damages & Claim Calculator Node - Gold/Amber Blueprint) */}
        {(caseItem.damages || []).map((dmg, index) => {
          const pos = getNodePos('damages', dmg.id, index);
          const isSelected = selectedNode?.type === 'damages' && selectedNode.id === dmg.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== dmg.id;
          const totalAmount = dmg.items.reduce((sum, item) => sum + item.amount, 0);
          const interestPerYear = (totalAmount * (dmg.interestRate || 5)) / 100;
          const inputState = newDamageItemInputs[dmg.id] || { label: '', amount: '' };

          return (
            <div
              key={`node-dmg-${dmg.id || index}-${index}`}
              data-node-id={dmg.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'damages', dmg.id, pos)}
              onMouseUp={() => handleNodeMouseUp(dmg.id)}
              onClick={(e) => handleNodeClick(e, dmg.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[310px] rounded-xl bg-slate-900/95 border shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-yellow-400 ring-4 ring-yellow-500/20'
                  : 'border-yellow-700/60 hover:border-yellow-400'
              }`}
            >
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-yellow-950 via-amber-900 to-slate-900 rounded-t-lg border-b border-yellow-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Calculator className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-bold text-[11px] text-white uppercase font-mono tracking-wider">
                    CLAIM // คำนวณค่าเสียหาย
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`ลบบัญชีค่าเสียหาย "${dmg.title}" หรือไม่?`)) {
                      deleteDamagesNode(caseItem.id, dmg.id);
                    }
                  }}
                  className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="ลบบัญชีนี้"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3.5 space-y-2.5 text-xs">
                <div>
                  <h4 className="font-bold text-slate-100 text-xs">{dmg.title}</h4>
                  <div className="text-[10px] text-yellow-400 mt-0.5 flex items-center space-x-1 font-mono">
                    <Coins className="w-3 h-3" />
                    <span>ดอกเบี้ยผิดนัด: {dmg.interestRate || 5}% ต่อปี</span>
                  </div>
                </div>

                {/* Image Slot for Damages */}
                <BlueprintImageSlot
                  imageUrl={dmg.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'damages', dmg.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `หลักฐานค่าเสียหาย: ${dmg.title}`,
                      type: 'ภาพหลักฐานค่าเสียหาย/ใบเสร็จ',
                      url,
                    })
                  }
                  label={dmg.title}
                />

                {/* Items List */}
                <div className="interactive-action bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 space-y-1.5">
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dmg.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-1 bg-slate-900/60 rounded text-[11px] border border-slate-800/60"
                      >
                        <span className="text-slate-300 truncate max-w-[170px]">{item.label}</span>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <span className="font-mono font-bold text-yellow-300">
                            {item.amount.toLocaleString()} ฿
                          </span>
                          <button
                            onClick={() => deleteDamageItem(caseItem.id, dmg.id, item.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                            title="ลบรายการ"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline Add Item Form */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-1">
                    <input
                      type="text"
                      placeholder="รายการใหม่..."
                      value={inputState.label}
                      onChange={(e) =>
                        setNewDamageItemInputs((prev) => ({
                          ...prev,
                          [dmg.id]: { ...inputState, label: e.target.value },
                        }))
                      }
                      className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-white focus:outline-none focus:border-yellow-500"
                    />
                    <input
                      type="number"
                      placeholder="จำนวนเงิน"
                      value={inputState.amount}
                      onChange={(e) =>
                        setNewDamageItemInputs((prev) => ({
                          ...prev,
                          [dmg.id]: { ...inputState, amount: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-white font-mono focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={() => {
                        const amt = parseFloat(inputState.amount);
                        if (inputState.label.trim() && !isNaN(amt)) {
                          addDamageItem(caseItem.id, dmg.id, {
                            label: inputState.label.trim(),
                            amount: amt,
                          });
                          setNewDamageItemInputs((prev) => ({
                            ...prev,
                            [dmg.id]: { label: '', amount: '' },
                          }));
                        }
                      }}
                      className="p-1 rounded bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold cursor-pointer"
                      title="เพิ่มรายการ"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Auto Calculated Sum Totals */}
                <div className="bg-yellow-950/40 p-2.5 rounded-lg border border-yellow-800/60 text-xs">
                  <div className="flex items-center justify-between font-bold text-yellow-300">
                    <span>ยอดรวมต้นเงิน:</span>
                    <span className="font-mono text-sm">{totalAmount.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>ดอกเบี้ยผิดนัด (5%/ปี):</span>
                    <span className="font-mono text-yellow-400">
                      +{interestPerYear.toLocaleString()} บ./ปี
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, dmg.id, 'damages', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(dmg.id, 'damages')}
                className="absolute -left-2 top-8 w-4 h-4 rounded-full border-2 border-yellow-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, dmg.id, 'damages', pos.x + 310, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(dmg.id, 'damages')}
                className="absolute -right-2 top-8 w-4 h-4 rounded-full border-2 border-yellow-400 bg-yellow-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}

        {/* NODE TYPE 7: โน้ตยุทธวิธีทนาย (Lawyer Scratchpad / Comment Box - Blueprint Comment Node) */}
        {(caseItem.lawyerNotes || []).map((note, index) => {
          const pos = getNodePos('note', note.id, index);
          const isSelected = selectedNode?.type === 'note' && selectedNode.id === note.id;
          const isTargetHighlight = wireConnecting && wireConnecting.fromNodeId !== note.id;

          return (
            <div
              key={`node-note-${note.id || index}-${index}`}
              data-node-id={note.id}
              onMouseDown={(e) => handleNodeMouseDown(e, 'note', note.id, pos)}
              onMouseUp={() => handleNodeMouseUp(note.id)}
              onClick={(e) => handleNodeClick(e, note.id)}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                boxShadow: isTargetHighlight ? `0 0 0 3.5px ${wireConnecting?.color || '#38bdf8'}` : undefined,
              }}
              className={`blueprint-node absolute w-[290px] rounded-xl bg-slate-950/90 border-2 shadow-2xl transition-shadow cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-amber-400 ring-4 ring-amber-500/20'
                  : 'border-amber-500/50 hover:border-amber-400'
              }`}
            >
              <div className="px-3 py-2 bg-gradient-to-r from-amber-950/80 to-slate-900 rounded-t-lg border-b border-amber-700/50 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-[11px] text-amber-300 font-mono">
                    {note.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('ลบโน้ตนี้หรือไม่?')) {
                      deleteLawyerNote(caseItem.id, note.id);
                    }
                  }}
                  className="interactive-action text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 text-xs space-y-2">
                <textarea
                  rows={3}
                  value={note.content}
                  onChange={(e) =>
                    updateLawyerNote(caseItem.id, {
                      ...note,
                      content: e.target.value,
                    })
                  }
                  className="interactive-action w-full bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-xs text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  placeholder="พิมพ์ข้อสังเกตหรือคำถามสำหรับซักค้าน..."
                />

                {/* Image Slot for Note */}
                <BlueprintImageSlot
                  imageUrl={note.imageUrl}
                  onUpdateImage={(url) => updateNodeImage(caseItem.id, 'note', note.id, url)}
                  onPreview={(url) =>
                    setPreviewFile({
                      name: `บันทึกทนาย: ${note.title}`,
                      type: 'ภาพบันทึกข้อความ',
                      url,
                    })
                  }
                  label={note.title}
                />
              </div>

              {/* Left Input Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, note.id, 'note', pos.x, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(note.id, 'note')}
                className="absolute -left-2 top-8 w-4 h-4 rounded-full border-2 border-amber-400 bg-slate-900 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Input)"
              />

              {/* Right Output Pin */}
              <div
                onMouseDown={(e) =>
                  handlePinMouseDown(e, note.id, 'note', pos.x + 290, pos.y + 40)
                }
                onMouseUp={() => handlePinMouseUp(note.id, 'note')}
                className="absolute -right-2 top-8 w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-600 hover:scale-125 transition-transform cursor-pointer"
                title="พอร์ตเชื่อมโยง (Output)"
              />
            </div>
          );
        })}
      </div>

      {/* 4. BLUEPRINT RIGHT-CLICK CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          className="blueprint-context-menu fixed z-50 w-72 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md p-2 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100 max-h-[480px] overflow-y-auto"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Search Header */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="ค้นหาบล็อกที่ต้องการสร้าง..."
              value={contextSearch}
              onChange={(e) => setContextSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 tracking-wider">
            บล็อกสำหรับสำนวนคดี (Case Data)
          </div>

          <div className="space-y-1">
            {/* 1. บุคคล (Person) */}
            {(!contextSearch || 'บุคคล person client defendant witness'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('person')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-emerald-300">
                      บุคคล (Person)
                    </div>
                    <div className="text-[10px] text-slate-400">ลูกความ, คู่กรณี, พยาน</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 2. เหตุการณ์ (Event) */}
            {(!contextSearch || 'เหตุการณ์ event timeline story'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('event')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-cyan-900/60 border border-cyan-600/50 flex items-center justify-center text-cyan-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-cyan-300">
                      เหตุการณ์ (Event)
                    </div>
                    <div className="text-[10px] text-slate-400">ลำดับข้อเท็จจริงตามวันที่</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 3. เอกสาร (Document) */}
            {(!contextSearch || 'เอกสาร document file contract evidence สัญญา'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('document')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-950/60 hover:text-amber-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-amber-300">
                      เอกสาร (Document)
                    </div>
                    <div className="text-[10px] text-slate-400">สัญญา, สลิป, แนบไฟล์จริงได้</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>

          <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 pt-2 tracking-wider border-t border-slate-800 mt-1">
            บล็อกเฉพาะทางสำหรับทนาย (Lawyer Functions)
          </div>

          <div className="space-y-1">
            {/* 4. ข้อกฎหมายและมาตรา (Legal Statute) */}
            {(!contextSearch || 'กฎหมาย มาตรา law statute claim'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('law')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-950/60 hover:text-purple-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-purple-900/60 border border-purple-600/50 flex items-center justify-center text-purple-400">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-purple-300">
                      ข้อกฎหมาย / มาตรา (Law)
                    </div>
                    <div className="text-[10px] text-slate-400">มาตรา & เช็คองค์ประกอบความรับผิด</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 5. ข้อต่อสู้ & กลยุทธ์ (Defense & Strategy) */}
            {(!contextSearch || 'กลยุทธ์ ข้อต่อสู้ strategy defense risk'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('strategy')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-950/60 hover:text-rose-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-rose-900/60 border border-rose-600/50 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-rose-300">
                      ข้อต่อสู้ / กลยุทธ์ (Strategy)
                    </div>
                    <div className="text-[10px] text-slate-400">ประเด็นรุก/รับ & แผนซักค้าน</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 6. คำนวณค่าเสียหาย (Damages Calculator) */}
            {(!contextSearch || 'ค่าเสียหาย damages claim calculator เงิน'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('damages')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-yellow-950/60 hover:text-yellow-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-yellow-900/60 border border-yellow-600/50 flex items-center justify-center text-yellow-400">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-yellow-300">
                      คำนวณค่าเสียหาย (Damages)
                    </div>
                    <div className="text-[10px] text-slate-400">รวมยอดเงินเรียกร้อง & ดอกเบี้ย</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 7. โน้ตทนาย (Lawyer Scratchpad) */}
            {(!contextSearch || 'โน้ต note comment บันทึก'.includes(contextSearch.toLowerCase())) && (
              <button
                onClick={() => handleOpenCreateModal('note')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-950/60 hover:text-amber-300 text-slate-200 transition cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-amber-300">
                      โน้ตทนาย (Lawyer Note)
                    </div>
                    <div className="text-[10px] text-slate-400">กล่องจดบันทึกยุทธวิธีรูปคดี</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. CREATE NODE MODAL (Supporting all 7 node types) */}
      {createModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <h3 className="font-bold text-base text-white">
                  {createModal.type === 'person' && 'สร้างบล็อกบุคคล (Person)'}
                  {createModal.type === 'event' && 'สร้างบล็อกเหตุการณ์ (Event)'}
                  {createModal.type === 'document' && 'สร้างบล็อกเอกสาร (Document)'}
                  {createModal.type === 'law' && 'สร้างบล็อกข้อกฎหมาย / มาตรา (Law)'}
                  {createModal.type === 'strategy' && 'สร้างบล็อกข้อต่อสู้ / กลยุทธ์ (Strategy)'}
                  {createModal.type === 'damages' && 'สร้างบล็อกคำนวณค่าเสียหาย (Damages)'}
                  {createModal.type === 'note' && 'สร้างบล็อกโน้ตทนาย (Lawyer Note)'}
                </h3>
              </div>
              <button
                onClick={() => setCreateModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreatedNode} className="space-y-4 text-xs">
              {/* PERSON FORM */}
              {createModal.type === 'person' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ชื่อ-นามสกุล / นิติบุคคล *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น นายสมชาย, กรรมการบริษัท ABC"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">บทบาทในคดี</label>
                    <select
                      value={newPersonRole}
                      onChange={(e) => setNewPersonRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="ลูกความ / โจทก์">ลูกความ / โจทก์</option>
                      <option value="คู่กรณี / จำเลย">คู่กรณี / จำเลย</option>
                      <option value="พยานบุคคล">พยานบุคคล</option>
                      <option value="ผู้เชี่ยวชาญ">ผู้เชี่ยวชาญ</option>
                      <option value="บุคคลที่เกี่ยวข้อง">บุคคลที่เกี่ยวข้อง</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">เบอร์โทรศัพท์ (ถ้ามี)</label>
                    <input
                      type="text"
                      placeholder="เช่น 081-234-5678"
                      value={newPersonPhone}
                      onChange={(e) => setNewPersonPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* EVENT FORM */}
              {createModal.type === 'event' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ชื่อเหตุการณ์ *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น ทำสัญญา, ผิดสัญญา, ยื่นฟ้อง"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">วันที่เกิดเหตุ</label>
                    <input
                      type="text"
                      placeholder="เช่น 12 มกราคม 2025 หรือ วันนี้"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">รายละเอียดเหตุการณ์</label>
                    <textarea
                      rows={3}
                      placeholder="อธิบายว่าเกิดอะไรขึ้น..."
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              )}

              {/* DOCUMENT FORM WITH REAL FILE ATTACHMENT */}
              {createModal.type === 'document' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ชื่อเอกสาร / หลักฐาน *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น สัญญาว่าจ้าง, สลิปโอนเงินงวดแรก, แคปแชท"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ประเภทเอกสาร</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="สัญญา">สัญญา</option>
                      <option value="หลักฐานการโอนเงิน">หลักฐานการโอนเงิน</option>
                      <option value="บัตรประชาชน">บัตรประชาชน</option>
                      <option value="รูปภาพ">รูปภาพ</option>
                      <option value="แชท">แชท</option>
                      <option value="หนังสือบอกกล่าว">หนังสือบอกกล่าว</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">แทรกไฟล์เอกสาร (แนบไฟล์จริง)</label>
                    <div className="border border-dashed border-amber-600/70 rounded-xl p-4 text-center bg-slate-950/60 hover:border-amber-400 transition">
                      {newDocFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-amber-400" />
                            <div className="text-left">
                              <div className="font-semibold text-slate-100 text-xs">{newDocFile.name}</div>
                              <div className="text-[10px] text-slate-400">{newDocFile.size}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewDocFile(null)}
                            className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                          <div className="text-xs font-semibold text-amber-300">คลิกเพื่อเลือกไฟล์แนบ</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">รองรับ PDF, JPG, PNG หรือเอกสาร</div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const sizeStr =
                                  f.size > 1024 * 1024
                                    ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
                                    : `${Math.round(f.size / 1024)} KB`;
                                const reader = new FileReader();
                                reader.onload = (loadEv) => {
                                  setNewDocFile({
                                    name: f.name,
                                    size: sizeStr,
                                    dataUrl: loadEv.target?.result as string,
                                  });
                                };
                                reader.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* LAW FORM */}
              {createModal.type === 'law' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">รหัสมาตรา / กฎหมาย *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น ป.พ.พ. มาตรา 387, มาตรา 213"
                      value={newLawCode}
                      onChange={(e) => setNewLawCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ชื่อหลักกฎหมาย / สิทธิเรียกร้อง</label>
                    <input
                      type="text"
                      placeholder="เช่น การบอกเลิกสัญญาเมื่อลูกหนี้ไม่ชำระหนี้"
                      value={newLawTitle}
                      onChange={(e) => setNewLawTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      องค์ประกอบความรับผิด (1 ข้อต่อ 1 บรรทัด)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="เช่น&#10;มีนิติกรรมสัญญาที่สมบูรณ์&#10;ลูกหนี้ผิดนัดไม่ชำระหนี้&#10;มีหนังสือบอกกล่าวให้เวลาพอสมควร"
                      value={newLawElementsText}
                      onChange={(e) => setNewLawElementsText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
                    />
                  </div>
                </>
              )}

              {/* STRATEGY FORM */}
              {createModal.type === 'strategy' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">หัวข้อประเด็นข้อต่อสู้ *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น ข้ออ้างเหตุส่งมอบล่าช้าจากซัพพลายเออร์"
                      value={newStratTitle}
                      onChange={(e) => setNewStratTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">ประเภทประเด็น</label>
                      <select
                        value={newStratSide}
                        onChange={(e) => setNewStratSide(e.target.value as any)}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white cursor-pointer"
                      >
                        <option value="opponent_defense">จำเลยอาจต่อสู้</option>
                        <option value="our_claim">ประเด็นรุกฝ่ายเรา</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">ระดับความเสี่ยง</label>
                      <select
                        value={newStratRisk}
                        onChange={(e) => setNewStratRisk(e.target.value as any)}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white cursor-pointer"
                      >
                        <option value="high">🔴 เสี่ยงสูง</option>
                        <option value="medium">🟡 เสี่ยงปานกลาง</option>
                        <option value="low">🟢 เสี่ยงต่ำ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ข้อต่อสู้หลัก</label>
                    <textarea
                      rows={2}
                      placeholder="จำเลยอาจต่อสู้ว่าอย่างไร..."
                      value={newStratArgument}
                      onChange={(e) => setNewStratArgument(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">แนวทางแก้ต่าง / แผนซักค้าน</label>
                    <textarea
                      rows={2}
                      placeholder="เตรียมนำสืบพยานหลักฐานแก้ว่า..."
                      value={newStratCounter}
                      onChange={(e) => setNewStratCounter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </>
              )}

              {/* DAMAGES FORM */}
              {createModal.type === 'damages' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ชื่อบัญชีค่าเสียหาย *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น บัญชีคำนวณยอดเงินเรียกร้องฟ้องคดี"
                      value={newDmgTitle}
                      onChange={(e) => setNewDmgTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">รายการแรก</label>
                      <input
                        type="text"
                        placeholder="เช่น ค่างวดจ่ายล่วงหน้า"
                        value={newDmgItemLabel}
                        onChange={(e) => setNewDmgItemLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">จำนวนเงิน (บาท)</label>
                      <input
                        type="number"
                        placeholder="500000"
                        value={newDmgItemAmount}
                        onChange={(e) => setNewDmgItemAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">อัตราดอกเบี้ยผิดนัด (% ต่อปี)</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={newDmgInterest}
                      onChange={(e) => setNewDmgInterest(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* NOTE FORM */}
              {createModal.type === 'note' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">หัวข้อบันทึก *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="เช่น 📌 บันทึกซักค้านพยาน, ข้อสังเกตสืบพยาน"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">ข้อความบันทึกยุทธวิธี</label>
                    <textarea
                      rows={4}
                      placeholder="พิมพ์ข้อความสรุปประเด็น..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* COMMON IMAGE ATTACHMENT FOR NEW NODE */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-slate-400 mb-1 font-semibold flex items-center justify-between">
                  <span>แนบรูปภาพประกอบบล็อก (ถ้ามี)</span>
                  {newImageAttachment && (
                    <button
                      type="button"
                      onClick={() => setNewImageAttachment(undefined)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      ลบรูป
                    </button>
                  )}
                </label>

                {newImageAttachment ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-700 h-24 bg-slate-950">
                    <img
                      src={newImageAttachment}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-slate-500 text-slate-300 text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>เลือกไฟล์รูปภาพจากเครื่อง</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (loadEv) => {
                              setNewImageAttachment(loadEv.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>สร้างบล็อกนี้</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FILE PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">{previewFile.name}</h3>
                  <span className="text-[10px] text-slate-400">{previewFile.type}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center min-h-[280px]">
              {previewFile.url && previewFile.url.startsWith('data:image') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-h-[350px] object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center space-y-3">
                  <FileText className="w-16 h-16 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300">เอกสารถูกแนบในบล็อก Mind Map เรียบร้อยแล้ว</p>
                  {previewFile.url && (
                    <a
                      href={previewFile.url}
                      download={previewFile.name}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      <span>ดาวน์โหลดไฟล์</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.5 ACTIVE WIRE CONNECTING BANNER */}
      {wireConnecting && (() => {
        const sourceColor = wireConnecting.color || getNodeColor(wireConnecting.fromNodeId, wireConnecting.fromType).main;
        return (
          <div
            className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full backdrop-blur-md text-xs shadow-2xl flex items-center space-x-3 pointer-events-auto border animate-pulse"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: sourceColor,
              color: '#ffffff',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sourceColor }} />
            <Link2 className="w-4 h-4" style={{ color: sourceColor }} />
            <span className="font-semibold text-xs text-slate-100">
              กำลังลากเส้นเชื่อมโยง: คลิกหรือปล่อยเมาส์บนบล็อกเป้าหมายเพื่อเชื่อมต่อ
            </span>
            <button
              onClick={() => setWireConnecting(null)}
              className="px-2 py-0.5 rounded-full bg-slate-900/80 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-[10px] cursor-pointer"
            >
              ✕ ยกเลิก (Esc)
            </button>
          </div>
        );
      })()}

      {/* 7. FULLSCREEN FLOATING HUD BANNER */}
      {isFullscreen && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-full backdrop-blur-md text-xs text-slate-300 shadow-2xl flex items-center space-x-3 pointer-events-auto">
          <span className="flex items-center space-x-1 text-sky-400 font-semibold font-mono text-[11px]">
            <span>⚡ BLUEPRINT FULLSCREEN</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">คลิกขวาเพื่อสร้างบล็อก</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">ลากเมาส์ขวาเพื่อเลื่อนมุมมอง</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1 rounded-md bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1"
          >
            <Minimize2 className="w-3 h-3 text-rose-300" />
            <span>ย่อหน้าต่าง (Esc)</span>
          </button>
        </div>
      )}

      {/* 8. AI STRUCTURING MODAL */}
      <AiStructuringModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        caseId={caseItem.id}
      />
    </div>
  );
};
