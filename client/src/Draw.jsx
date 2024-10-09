import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

export const ExcalidrawCollaboration = () => {
    const [excalidrawAPI1, setExcalidrawAPI1] = useState(null);
    const [excalidrawAPI2, setExcalidrawAPI2] = useState(null);


    const getSceneData = () => {
        if (excalidrawAPI1) {
            var currentElements = excalidrawAPI1.getSceneElements();
            var currentAppState = excalidrawAPI1.getAppState();

        }

        if (currentElements && currentAppState) {
            var sceneData = {
                elements: currentElements,
                appState: currentAppState,
            };
        }
        if (sceneData) {
            if (excalidrawAPI2) {
                excalidrawAPI2.updateScene(sceneData);
            }
        }

    };

    const getSceneData1 = () => {
        if (excalidrawAPI2) {
            var currentElements = excalidrawAPI2.getSceneElements();
            var currentAppState = excalidrawAPI2.getAppState();

        }

        if (currentElements && currentAppState) {
            var sceneData = {
                elements: currentElements,
                appState: currentAppState,
            };
        }
        if (sceneData) {
            if (excalidrawAPI1) {
                excalidrawAPI1.updateScene(sceneData);
            }
        }

    };

    const [intervalId, setIntervalId] = useState(null);

    const handleMouseEnter = () => {

        if (!intervalId) {
            const id = setInterval(() => {
                console.log("Action running every 300 ms");
                getSceneData();

            }, 1250);
            setIntervalId(id);
        }
    };

    const handleMouseLeave = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    return (
        <div>
            <div onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove} style={{ height: "500px", width: "500px", display: "inline-block" }}>
                <p style={{ fontSize: "16px" }}>Excalidraw 1</p>

                <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI1(api)} />
            </div>

            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ height: "500px", width: "500px", display: "inline-block" }}>
                <p style={{ fontSize: "16px" }}>Excalidraw 2</p>
                <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI2(api)} />
            </div>


        </div>
    );
};


