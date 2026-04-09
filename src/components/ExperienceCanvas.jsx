import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, ReactFlowProvider, useReactFlow, Handle, Position } from '@xyflow/react';
import { User, Building2, GraduationCap, X } from 'lucide-react';
import '@xyflow/react/dist/style.css';

// Custom Main Node component (Profile)
const MainNode = ({ data }) => {
    return (
        <div className="p-4 flex flex-col items-center justify-center rounded-xl bg-[#111111] text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-orange-500 transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ width: '200px' }}>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shadow-inner flex items-center justify-center border border-gray-800 shrink-0">
                <User size={20} className="text-orange-500" />
            </div>
            <div className="font-bold text-lg text-orange-500 text-center tracking-wide leading-tight truncate w-full min-w-0 mt-3">{data.name}</div>
            <div className="text-[10px] text-gray-500 font-mono mt-2 shrink-0">Click to explore career</div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#f97316', width: '8px', height: '8px' }} />
        </div>
    );
};

// Custom Exp Node component (Company)
const ExpNode = ({ data }) => {
    const isEdu = data.companyName.includes('UNIVERSITY');
    return (
        <div
            className="relative px-6 py-4 rounded-xl bg-[#141414] border-2 shadow-xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            style={{
                width: '260px',
                borderColor: data.color || '#3b82f6',
                boxShadow: data.expanded ? `0 0 15px ${data.color}40` : 'none'
            }}
        >
            <Handle type="target" position={Position.Top} style={{ minWidth: 0, minHeight: 0, width: 0, height: 0, border: 'none', background: 'transparent' }} />

            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${data.color}15`, color: data.color }}
            >
                {isEdu ? <GraduationCap size={20} /> : <Building2 size={20} />}
            </div>
            <div className="flex-1 w-full min-w-0">
                <h3 className="font-bold text-gray-100 text-sm truncate">{data.companyName}</h3>
                <p className="text-[10px] text-gray-400 mt-1 font-mono tracking-wider truncate">{data.date}</p>
            </div>
            <div
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-[3px] border-[#0a0a0a]"
                style={{ backgroundColor: data.color }}
            >
                {data.projectCount}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: data.color, width: '8px', height: '8px' }} />
        </div>
    );
};

// Custom Project Node component (Summary)
const ProjectNode = ({ data }) => {
    return (
        <div
            className="px-5 py-4 rounded-xl bg-[#1a1a1a] border border-gray-800 hover:border-gray-500 text-white shadow-sm cursor-pointer transition-colors relative overflow-hidden"
            style={{ width: '280px' }}
        >
            {/* Inner Border Indicator */}
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: data.color }} />

            <Handle type="target" position={Position.Top} style={{ minWidth: 0, minHeight: 0, width: 0, height: 0, border: 'none', background: 'transparent' }} />

            <div className="flex gap-2 text-[10px] mb-3 items-center ml-2 w-full min-w-0">
                <span className="bg-[#222] px-2 py-0.5 rounded text-gray-400 font-mono truncate max-w-[120px]">{data.companyName}</span>
                <span className="text-gray-300 font-bold uppercase tracking-wider truncate max-w-[80px]">{data.tags?.[0] || 'Project'}</span>
            </div>

            <h3 className="font-bold text-lg mb-4 text-gray-100 leading-tight ml-2 truncate w-full min-w-0">{data.role}</h3>

            <div className="flex gap-4 text-[10px] ml-2 items-center w-full min-w-0 pr-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${data.impactColor || 'bg-blue-500'}`}></span>
                <span className="truncate flex-1 font-semibold text-gray-300">{data.impact}</span>
                <span className="bg-[#222] px-2 py-0.5 rounded shrink-0">{data.techCount}</span>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
};

// Expanded Project Node (Detail Modal)
const ExpandedProjectNode = ({ data }) => {
    return (
        <div
            className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 shadow-2xl z-50 cursor-pointer relative overflow-hidden"
            style={{
                width: '550px',
                boxShadow: `0 0 40px ${data.color}20`
            }}
            onClick={(e) => {
                // Prevent event bubbling if clicking 'X' so toggle works, otherwise just toggle
                e.stopPropagation();
                data.onToggle(data.id);
            }}
        >
            {/* Inner Border Indicator */}
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: data.color }} />

            <Handle type="target" position={Position.Top} className="opacity-0" />

            <button
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-[#1a1a1a] p-1 rounded-md z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    data.onToggle(data.id);
                }}
            >
                <X size={16} />
            </button>

            <div className="flex gap-2 mb-4 ml-2 relative z-10">
                {data.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#222] text-gray-300 text-[10px] uppercase font-bold tracking-wider rounded border border-gray-800">
                        {tag}
                    </span>
                ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-5 leading-tight ml-2 relative z-10">{data.role}</h3>

            <div className="bg-[#222] p-4 rounded-xl border border-gray-800 text-sm text-gray-300 mb-5 leading-relaxed ml-2 relative z-10">
                {data.description}
            </div>

            <div className="bg-[#222] p-4 rounded-xl border border-gray-800 text-sm mb-6 ml-2 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${data.impactColor || 'bg-gray-500'}`}></span>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Impact</div>
                </div>
                <div className="font-bold text-[15px]" style={{ color: data.color }}>
                    {data.impact}
                </div>
            </div>

            <div className="ml-2 relative z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Technologies</div>
                <div className="flex flex-wrap gap-2">
                    {data.techUsed?.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#222] text-gray-300 text-xs font-mono rounded-lg border border-gray-700/50 hover:border-gray-500 transition-colors">
                            {tech.trim()}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-600 font-mono animate-pulse relative z-10">
                Click card to collapse
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
};

const nodeTypes = {
    mainNode: MainNode,
    expNode: ExpNode,
    projectNode: ProjectNode,
    expandedProjectNode: ExpandedProjectNode
};

const FlowContext = ({ profileData, experiences }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    // Topology State
    const [rootExpanded, setRootExpanded] = useState(false);
    const [expandedCompanies, setExpandedCompanies] = useState(new Set());
    const [expandedProject, setExpandedProject] = useState(null);
    const [nodeDimensions, setNodeDimensions] = useState({});
    const { setCenter, fitView } = useReactFlow();
    const lastPannedRef = useRef(null);

    // Toggle Handlers
    const toggleRoot = () => {
        setRootExpanded(prev => {
            if (prev) {
                // Recursive State Reset on Collapse
                setExpandedCompanies(new Set());
                setExpandedProject(null);
            }
            return !prev;
        });
    };

    const toggleCompany = (expId) => {
        setExpandedCompanies(prev => {
            const next = new Set(prev);
            if (next.has(expId)) {
                next.delete(expId);
                // Optionally collapse its projects too when company collapses
                setExpandedProject(prevProject => {
                    const isChildProject = experiences.find(e => e.id === expId)?.projects?.some(proj => `proj-${expId}-${proj.id}` === prevProject);
                    return isChildProject ? null : prevProject;
                });
            } else {
                next.add(expId);
            }
            return next;
        });
    };

    const toggleProject = useCallback((projNodeId) => {
        setExpandedProject(prev => prev === projNodeId ? null : projNodeId);
    }, []);

    // Engine: Recompute nodes/edges whenever state changes
    useEffect(() => {
        if (!profileData || !experiences) return;

        const newNodes = [];
        const newEdges = [];

        // 1. Render Root
        // ExpNodes are [w:260], spacing 320 -> centers are 130, 450, 770.
        // Middle company center is 450. MainNode is [w:200], radius 100.
        // x: 350 + 100 = 450 perfectly aligns.
        newNodes.push({
            id: 'root',
            type: 'mainNode',
            position: { x: 350, y: 50 },
            data: {
                name: profileData.name
            },
        });

        // If root is collapsed, stop here
        if (!rootExpanded) {
            setNodes(newNodes);
            setEdges(newEdges);
            return;
        }



        // Global Layout Recalculation: Dynamic Spatial Awareness
        // Find the absolute maximum width required by each company branch to implement hard bounds.
        const branchWidths = experiences.map(exp => {
            let maxW = 260; // Base width of company node
            if (exp.projects) {
                exp.projects.forEach(p => {
                    const projNodeId = `proj-${exp.id}-${p.id}`;
                    const isExpanded = expandedProject === projNodeId;
                    const fallbackWidth = isExpanded ? 550 : 280;
                    const actualW = nodeDimensions[projNodeId]?.width || fallbackWidth;
                    if (actualW > maxW) maxW = actualW;
                });
            }
            return maxW;
        });

        const GAP = 120; // Hard boundary minimum gap between visual elements of adjacent trees
        const relativeCenters = [];
        let currentTotalX = 0;

        for (let i = 0; i < experiences.length; i++) {
            if (i === 0) {
                relativeCenters.push(0);
            } else {
                const spacing = (branchWidths[i - 1] / 2) + GAP + (branchWidths[i] / 2);
                currentTotalX += spacing;
                relativeCenters.push(currentTotalX);
            }
        }

        // Perfectly balance the entire tree under the parent central node.
        const centerOfParent = 450;
        const structureMidpoint = currentTotalX / 2;
        const startXCenter = centerOfParent - structureMidpoint;

        experiences.forEach((exp, index) => {
            const expNodeId = `exp-${exp.id}`;
            const projCount = exp.projects?.length || 0;

            const expCenterX = startXCenter + relativeCenters[index];
            const expX = expCenterX - 130; // 130 is half of 260 width base company dimension

            const isCompanyExpanded = expandedCompanies.has(exp.id);

            newNodes.push({
                id: expNodeId,
                type: 'expNode',
                position: { x: expX, y: 300 },
                data: {
                    companyName: exp.companyName,
                    date: exp.timeline.split(' - ')[0] + ' - ' + exp.timeline.split(' - ')[1].substring(0, 4), // Changed to 'date'
                    color: exp.color,
                    projectCount: projCount,
                    expanded: isCompanyExpanded
                },
            });

            newEdges.push({
                id: `edge-root-${expNodeId}`,
                source: 'root',
                target: expNodeId,
                type: 'step',
                animated: true,
                style: { stroke: exp.color || '#3b82f6', strokeWidth: 1.5, opacity: 0.8 },
            });

            // 3. Render Projects if Company is expanded
            if (isCompanyExpanded && projCount > 0) {

                // Keep track of accumulated height to stack projects correctly, especially if expanded
                let currentY = 500;

                exp.projects.forEach((proj, pIndex) => {
                    const projNodeId = `proj-${exp.id}-${proj.id}`;
                    const isProjExpanded = expandedProject === projNodeId;

                    const nodeWidth = nodeDimensions[projNodeId]?.width || (isProjExpanded ? 550 : 280);
                    const projX = expCenterX - (nodeWidth / 2);

                    newNodes.push({
                        id: projNodeId,
                        type: isProjExpanded ? 'expandedProjectNode' : 'projectNode',
                        position: { x: projX, y: currentY },
                        data: {
                            ...proj,
                            id: projNodeId, // needed for toggle callback logic if we pass it down
                            companyName: exp.companyName,
                            color: exp.color,
                            onToggle: toggleProject
                        },
                    });

                    // Edge connections: Company -> Proj 1 -> Proj 2
                    const sourceNode = pIndex === 0 ? expNodeId : `proj-${exp.id}-${exp.projects[pIndex - 1].id}`;

                    newEdges.push({
                        id: `edge-${sourceNode}-${projNodeId}`,
                        source: sourceNode,
                        target: projNodeId,
                        type: 'step',
                        style: { stroke: exp.color || '#3b82f6', strokeWidth: 1.5, opacity: 0.8 },
                    });

                    // Dynamically calculate gap based on ACTUAL content height!
                    let nodeHeight = nodeDimensions[projNodeId]?.height || (isProjExpanded ? 400 : 160);

                    currentY += nodeHeight + (isProjExpanded ? 40 : 15);
                });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);

    }, [profileData, experiences, rootExpanded, expandedCompanies, expandedProject, toggleProject, nodeDimensions]);

    // Dedicated Focus synchronizer Effect for Fit-to-Viewport constraint
    useEffect(() => {
        if (!expandedProject) {
            lastPannedRef.current = null;
            return;
        }

        if (nodes.length > 0) {
            const expNode = nodes.find(n => n.type === 'expandedProjectNode' && n.data.id === expandedProject);
            if (expNode) {
                const actualDim = nodeDimensions[expandedProject];
                const pannedKey = `${expandedProject}-settled`;

                // Run focus logic strictly AFTER we receive actual DOM geometries and only once per expansion instance
                if (actualDim && lastPannedRef.current !== pannedKey) {
                    const centerX = expNode.position.x + (actualDim.width / 2);
                    const centerY = expNode.position.y + (actualDim.height / 2);

                    // Defer pan shortly preventing ReactFlow internal DOM mismatch mid-render
                    setTimeout(() => {
                        // Use native fitView exactly scaling the requested node bounding box while enforcing rules dynamically
                        fitView({
                            nodes: [{ id: expandedProject }],
                            padding: 0.2, // Requirement 3: Enforces a smart 20% safe-area margin preventing cutoff
                            maxZoom: 1.05, // Requirement 2.2: Do not zoom closer than 1.05 threshold for smaller cards
                            duration: 450
                        });
                    }, 50);

                    lastPannedRef.current = pannedKey;
                }
            }
        }
    }, [expandedProject, nodes, nodeDimensions, fitView]);




    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
            
            // Extract dimension changes to perfectly adapt node layout padding globally
            const dimChanges = changes.filter(c => c.type === 'dimensions' && c.dimensions);
            if (dimChanges.length > 0) {
                setNodeDimensions(prev => {
                    const next = { ...prev };
                    let changed = false;
                    dimChanges.forEach(c => {
                        const existing = next[c.id] || {};
                        if (existing.width !== c.dimensions.width || existing.height !== c.dimensions.height) {
                            next[c.id] = { width: c.dimensions.width, height: c.dimensions.height };
                            changed = true;
                        }
                    });
                    return changed ? next : prev;
                });
            }
        },
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    // Global Click Handler used for toggling
    const onNodeClick = (event, node) => {
        // Calculate the center of the clicked node based on its measured dimensions if available
        const nodeWidth = node.measured?.width || (node.type === 'mainNode' ? 200 : (node.type === 'expNode' ? 260 : 280));
        const nodeHeight = node.measured?.height || 100;

        const centerX = node.position.x + nodeWidth / 2;
        const centerY = node.position.y + nodeHeight / 2;

        if (node.type === 'mainNode') {
            toggleRoot();
            setCenter(centerX, centerY + 150, { zoom: 0.8, duration: 800 });
        }
        else if (node.type === 'expNode') {
            const expId = node.id.replace('exp-', '');
            toggleCompany(expId);
            setCenter(centerX, centerY + 200, { zoom: 0.9, duration: 800 });
        }
        else if (node.type === 'projectNode') {
            const projNodeId = node.id;
            toggleProject(projNodeId);
            // Recomputed center panning happens automatically in useEffect hook above!
        }
    };

    return (
        <div className="w-full h-full relative p-4">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.5 }}
                minZoom={0.2}
                maxZoom={1.5}
                className="bg-[#0a0a0a]"
                nodesDraggable={false} // Lock nodes to preserve layout
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#2a2a2a" gap={20} size={2} />
            </ReactFlow>
        </div>
    );
};

// Wrap in provider
const ExperienceCanvas = (props) => {
    return (
        <ReactFlowProvider>
            <FlowContext {...props} />
        </ReactFlowProvider>
    );
};

export default ExperienceCanvas;
