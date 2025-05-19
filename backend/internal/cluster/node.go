package cluster

import (
	"sync"
	"vistardb/internal/storage"
)

type Node struct {
	ID string
	Address string
	Store storage.Engine
	Peers []string
	mu sync.RWMutex
}

func NewNode (id, addr string, store storage.Engine) *Node {
	return &Node {
		ID : id,
		Address: addr,
		Store : store,
		Peers : make([]string, 0),
	}
}

func (n *Node) AddPeer(addr string){
	n.mu.Lock()
	defer n.mu.Unlock()

	n.Peers = append(n.Peers, addr)
}

func (n *Node) GetStatus() map[string] interface {} {
	n.mu.RLock()
	defer n.mu.RUnlock()

	return map[string] interface {}{
		"id" : n.ID,
		"address" : n.Address,
		"peers" : n.Peers,
		"status" : "healthy",
		"tables" : n.Store.ListTables(),
	}
}