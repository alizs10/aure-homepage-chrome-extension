import Header from "./components/Header";
import CounterList from "./components/CounterList";
import CounterModal from "./modals/CounterModal";
import CounterDetailModal from "./modals/CounterDetailModal"; // 🌟 Import new modal
import { useState } from "react";
import type { Counter } from "./types";

export default function Counters() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
    const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null); // 🌟 New state

    const handleAdd = () => {
        setEditingCounter(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingCounter(null);
    };

    const handleSelect = (counter: Counter) => {
        setSelectedCounter(counter);
    };

    // 🌟 Bridge from Detail Modal to Edit Modal
    const handleEditFromDetail = () => {
        if (selectedCounter) {
            setEditingCounter(selectedCounter);
            setModalOpen(true);
            setSelectedCounter(null); // Close detail modal
        }
    };

    return (
        <div className="w-full flex flex-col p-5 rounded-3xl liquid-glass h-full gap-y-2">
            <Header onAdd={handleAdd} />

            {/* 🌟 Pass onSelect instead of onEdit */}
            <CounterList onSelect={handleSelect} />

            {/* 🌟 Render Detail Modal */}
            {selectedCounter && (
                <CounterDetailModal
                    open={true}
                    onClose={() => setSelectedCounter(null)}
                    counter={selectedCounter}
                    onEdit={handleEditFromDetail}
                />
            )}

            {/* Render Edit/Add Modal */}
            {modalOpen && (
                <CounterModal
                    open={modalOpen}
                    onClose={handleClose}
                    counter={editingCounter}
                />
            )}
        </div>
    );
}