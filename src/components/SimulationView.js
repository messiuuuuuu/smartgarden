import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, DragOverlay, pointerWithin, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
// BUG FIX: Import `remove` function from firebase
import { ref, update, onValue, remove } from 'firebase/database';
import { realtimedb } from '../firebaseConfig';

const DraggableDevice = React.forwardRef(({ device, showName, ...props }, ref) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/devices/${device.id}`);

    return (
        <div 
            className="relative flex flex-col items-center" 
            title={`Tên: ${device.name}\nĐộ ẩm: ${device.doAmDat?.current}%`}
        >
            <div
                ref={ref}
                {...props}
                onClick={handleClick}
                className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center cursor-pointer shadow-md border border-gray-200 hover:shadow-lg hover:border-green-400 transition-all duration-200"
            >
                <img src={device.imageUrl || '/img/default-device.png'} alt={device.name} className="w-20 h-20 rounded-full object-cover" />
            </div>
            {showName && (
                <span className="mt-2 text-sm font-semibold text-gray-700 truncate w-24 text-center">
                    {device.name}
                </span>
            )}
        </div>
    );
});
DraggableDevice.displayName = 'DraggableDevice';

const SortableDevice = ({ device }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: device.id, data: { device } });

    const style = {
        position: 'absolute',
        left: device.position?.x,
        top: device.position?.y,
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 10,
    };

    if (!device.position) {
        return (
             <DraggableDevice ref={setNodeRef} device={device} showName={true} {...attributes} {...listeners} />
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <DraggableDevice device={device} showName={true} />
        </div>
    );
};

const DroppableContainer = ({ id, children, className, ...props }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} id={id} className={className} {...props}>
            {children}
        </div>
    );
}

const SimulationView = ({ devices }) => {
    const [deviceList, setDeviceList] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        setDeviceList(devices.map(d => ({ ...d })));
        const unsubscribeFunctions = devices.map(device => {
            const deviceRef = ref(realtimedb, `devices/${device.id}/position`);
            return onValue(deviceRef, (snapshot) => {
                const position = snapshot.val();
                setDeviceList(prevList =>
                    prevList.map(d => (d.id === device.id ? { ...d, position: position } : d))
                );
            });
        });
        return () => unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    }, [devices]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(KeyboardSensor)
    );

    const placedDevices = deviceList.filter(d => d.position);
    const unplacedDevices = deviceList.filter(d => !d.position);
    const activeDevice = activeId ? deviceList.find(d => d.id === activeId) : null;
    const isDragging = activeId !== null;

    const handleDragStart = ({ active }) => setActiveId(active.id);

    const handleDragEnd = ({ active, over, delta }) => {
        setActiveId(null);
        if (!over || !active) return;

        const activeId = active.id;
        const overId = over.id;

        const activeDevice = deviceList.find(d => d.id === activeId);
        if (!activeDevice) return;

        const isInitiallyPlaced = activeDevice.position !== null && activeDevice.position !== undefined;
        const sourceContainer = isInitiallyPlaced ? 'canvas' : 'sidebar';

        const unplacedIds = unplacedDevices.map(d => d.id);
        const placedIds = placedDevices.map(d => d.id);
        
        let destinationContainer;
        if (overId === 'canvas' || placedIds.includes(overId)) {
            destinationContainer = 'canvas';
        } else if (overId === 'sidebar' || unplacedIds.includes(overId)) {
            destinationContainer = 'sidebar';
        } else {
            return;
        }

        if (sourceContainer === 'canvas' && destinationContainer === 'sidebar') {
            setDeviceList(prev => prev.map(d => d.id === activeId ? { ...d, position: null } : d));
            // BUG FIX: Use `remove` instead of `update` with null
            remove(ref(realtimedb, `devices/${activeId}/position`));
            return;
        }

        if (sourceContainer === 'sidebar' && destinationContainer === 'canvas') {
            const canvasNode = canvasRef.current;
            if (!canvasNode) return;
            const canvasRect = canvasNode.getBoundingClientRect();
            const newPosition = {
                x: active.rect.current.initial.left - canvasRect.left + delta.x,
                y: active.rect.current.initial.top - canvasRect.top + delta.y
            };
            setDeviceList(prev => prev.map(d => d.id === activeId ? { ...d, position: newPosition } : d));
            update(ref(realtimedb, `devices/${activeId}/position`), newPosition);
            return;
        }

        if (sourceContainer === 'canvas' && destinationContainer === 'canvas') {
            const newPosition = {
                x: activeDevice.position.x + delta.x,
                y: activeDevice.position.y + delta.y
            };
            setDeviceList(prev => prev.map(d => d.id === activeId ? { ...d, position: newPosition } : d));
            update(ref(realtimedb, `devices/${activeId}/position`), newPosition);
            return;
        }
    };
    
    const gridBgStyle = {
        backgroundSize: '40px 40px',
        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
    };

    return (
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 mt-8">
                <div ref={canvasRef} style={{ flexGrow: 1, height: '32rem' }}>
                    <DroppableContainer id="canvas" className={`h-full rounded-lg border-2 relative transition-all duration-200 ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`} style={gridBgStyle}>
                        {placedDevices.length === 0 && !isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <div className="flex flex-col items-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <p className="text-lg font-medium">Kéo thả thiết bị vào đây để bố trí</p>
                                </div>
                            </div>
                        )}
                        <SortableContext items={placedDevices.map(d => d.id)}>
                            {placedDevices.map(device => <SortableDevice key={device.id} device={device} />)}
                        </SortableContext>
                     </DroppableContainer>
                </div>

                <DroppableContainer id="sidebar" className="md:w-80 flex-shrink-0 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Thiết bị chưa đặt</h3>
                    {unplacedDevices.length > 0 ? (
                        <SortableContext items={unplacedDevices.map(d => d.id)}>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {unplacedDevices.map(device => <SortableDevice key={device.id} device={device} />)}
                            </div>
                        </SortableContext>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center flex-grow text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="mt-3 font-semibold text-base">Đã bố trí hết thiết bị</p>
                        </div>
                    )}
                </DroppableContainer>
            </div>
            <DragOverlay>
                {activeId && activeDevice ? <DraggableDevice device={activeDevice} showName={true} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default SimulationView;
