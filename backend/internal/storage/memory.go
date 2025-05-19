package storage

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
)

type MemoryStorage struct {
	tables map[string]map[string]Record
	mu     sync.RWMutex
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		tables: make(map[string]map[string]Record),
	}
}

func (m *MemoryStorage) CreateTable(table string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.tables[table]; exists {
		return errors.New("table already exists")
	}

	m.tables[table] = make(map[string]Record)
	return nil
}

func (m *MemoryStorage) Insert(table string, record Record) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	t, exists := m.tables[table]
	if !exists {
		return "", errors.New("table does exist")
	}

	id := uuid.New().String()
	record["id"] = id
	record["created_at"] = time.Now()

	t[id] = record

	return id, nil
}

func (m *MemoryStorage) Get(table, id string) (Record, error) {
	m.mu.RLock()

	defer m.mu.RUnlock()

	t, exists := m.tables[table]
	if !exists {
		return nil, errors.New("table does not exist")
	}

	record, exists := t[id]

	if !exists {
		return nil, errors.New("record not found")
	}

	return record, nil
}

func (m *MemoryStorage) GetAll(table string) ([]Record, error){
	m.mu.RLock()

	defer m.mu.RUnlock()

	t, exists := m.tables[table]
	if !exists {
		return nil, errors.New("table does not exist")
	}

	records := make([]Record, 0, len(t))
	for _, record := range t {
		records = append(records, record)
	}

	return records, nil
}

func (m *MemoryStorage) ListTables() []string {
	m.mu.RLock()
	defer m.mu.RUnlock()

	tables := make([]string, 0, len(m.tables))
	for table := range m.tables {
		tables = append(tables, table)
	}

	return tables
}

func (m *MemoryStorage) Delete(table, id string) error {
	m.mu.Lock()
	defer m.mu.RLock()

	t, exists := m.tables[table]
	if !exists {
		return errors.New("table does not exist")
	}
	
	delete(t, id)
	return nil
}