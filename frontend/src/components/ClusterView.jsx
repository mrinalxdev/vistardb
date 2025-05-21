import React, { useState, useEffect } from 'react';
import { getClusterStatus, getTables, createTable } from '../api';
import NodeStatus from './NodeStatus';
import DataTable from './DataTable';

const ClusterView = () => {
  const [clusterStatus, setClusterStatus] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newTableName, setNewTableName] = useState('');

  const loadClusterData = async () => {
    try {
      const status = await getClusterStatus();
      setClusterStatus(status);
      
      const tableList = await getTables();
      setTables(tableList);
    } catch (err) {
      console.error('Failed to load cluster data:', err);
    }
  };

  const handleCreateTable = async () => {
    if (!newTableName) return;
    
    try {
      await createTable(newTableName);
      setNewTableName('');
      await loadClusterData();
    } catch (err) {
      console.error('Failed to create table:', err);
    }
  };

  useEffect(() => {
    loadClusterData();
  }, []);

  if (!clusterStatus) return <div>Loading cluster status...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Distributed Database</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <NodeStatus node={clusterStatus} />
          
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Tables</h3>
            <ul className="space-y-1">
              {tables.map(table => (
                <li 
                  key={table} 
                  className={`p-2 rounded cursor-pointer ${selectedTable === table ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedTable(table)}
                >
                  {table}
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <input
                type="text"
                placeholder="New table name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="border rounded p-2 w-full mb-2"
              />
              <button 
                onClick={handleCreateTable}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedTable ? (
            <DataTable tableName={selectedTable} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select a table to view data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClusterView;