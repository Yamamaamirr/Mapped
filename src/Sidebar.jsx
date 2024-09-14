// src/Sidebar.js
import React, { useState, useRef } from 'react';
import { EyeIcon, PlusIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ 
  onGeoJsonUpload, 
  layers, 
  onToggleLayer, 
  onSaveLayer, 
  setSelectedLayerId, 
  onDeleteLayer, 
  handleClickZoom 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const geojson = JSON.parse(reader.result);
          const fileName = file.name.split('.').slice(0, -1).join('.');
          onGeoJsonUpload(geojson, fileName);
          event.target.value = ''; // Clear file input after upload
        } catch (error) {
          console.error('Invalid GeoJSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLayerSelect = (event) => {
    setSelectedLayerId(event.target.value);
  };

  return (
    <>
      <div 
        className={`fixed top-14 right-0 z-20 h-[calc(100vh-3.7rem)] bg-white shadow-md border-l border-gray-300 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center border-b border-gray-300 p-2 bg-gray-100">
          <button
            className="bg-blue-500 hover:bg-blue-600 p-1 rounded-md mr-2"
            onClick={() => fileInputRef.current.click()}
          >
            <PlusIcon className="h-5 w-5 text-white font-bold" />
          </button>
          <h3 className="font-semibold text-gray-800 text-sm flex-1">Layers</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-2"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <ArrowLeftIcon className={`h-5 w-5 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <input
            type="file"
            accept=".geojson"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Layer List */}
        <div className="flex flex-col p-2 space-y-2 overflow-y-auto flex-grow">
          {layers.length > 0 ? (
            layers.map(layer => (
              <div
                key={layer.id}
                className="flex items-center justify-between mb-1 border-b py-1"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => (document.body.style.cursor = 'pointer')}
                onMouseLeave={() => (document.body.style.cursor = 'default')}
                onClick={() => handleClickZoom(layer.id)}
              >
                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayer(layer.id);
                    }}
                  >
                    <EyeIcon className={`h-5 w-5 ${layer.visible ? '' : 'opacity-50'}`} />
                  </button>
                  <span className="text-gray-800 text-sm">{layer.name}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center text-sm">No layers uploaded yet</div>
          )}
        </div>

        {/* Layer Selection and Save Button */}
        <div className="flex flex-col p-2 mt-auto">
          <label htmlFor="layer-select" className="text-gray-800 mb-1 text-sm">Select Layer:</label>
          <select
            id="layer-select"
            className="border border-gray-300 rounded p-1 text-sm"
            onChange={handleLayerSelect}
          >
            <option value="">--Select a Layer--</option>
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.name}
              </option>
            ))}
          </select>
          <button
            className="mt-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm"
            onClick={onSaveLayer}
            disabled={!layers.some(layer => layer.visible)}
          >
            Save Layer
          </button>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'hidden' : 'block'} w-8 h-10 z-10`}
        onClick={() => setSidebarOpen(true)}
      >
        <div className="relative flex justify-center items-center h-full w-full">
          <div className="absolute h-14 w-24 bg-blue-500 rounded-bl-full rounded-br-full rotate-90 flex items-center justify-center">
            <div className="absolute text-white text-xl font-bold">≡</div>
            <div className="absolute top-1/2 right-0 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-blue-500 border-l-6 border-l-transparent transform translate-x-1"></div>
          </div>
        </div>
      </button>
    </>
  );
};

export default Sidebar;
