import React from "react"

const NodeStatus = ({node}) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Node : {node.id}</h3>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className="text-sm text-gray-600">Address </p>
                    <p>{node.address}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">Status : </p>
                    <p className="text-green-500">{node.status}</p>
                </div>

                <div className="mt-4">
                    <h4 className="font-medium mb-1">Peers :</h4>
                    {NodeStatus.peers.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {node.peers.map((peer, i) => (
                                <li key={i}>{peer}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No Peers connected</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NodeStatus