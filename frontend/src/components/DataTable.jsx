import React, { useState } from 'react';
import { getTableData, insertRecord } from '../api';

const DataTable = ({ tableName }) => {
  const [data, setData] = useState([]);
  const [newRecord, setNewRecord] = useState({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const tableData = await getTableData(tableName);
      setData(tableData);
    } catch (err) {
      console.error('Failed to load table data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    try {
      await insertRecord(tableName, newRecord);
      setNewRecord({});
      await loadData();
    } catch (err) {
      console.error('Failed to insert record:', err);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [tableName]);

  if (loading) return <div>Loading...</div>;

  if (data.length === 0) return <div>No data available</div>;

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{tableName}</h3>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Add New Record</h4>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {columns.map(col => (
              <input
                key={col}
                type="text"
                placeholder={col}
                value={newRecord[col] || ''}
                onChange={(e) => setNewRecord({...newRecord, [col]: e.target.value})}
                className="border rounded p-1 text-sm"
              />
            ))}
          </div>
          <button 
            onClick={handleInsert}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Insert
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={`${i}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;