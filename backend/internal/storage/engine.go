package storage

type Record map[string]interface{}

type Engine interface {
	CreateTable(table string) error
	Insert(table string, record Record) (string, error)
	Get(table, id string) (Record, error)
	GetAll(table string) ([]Record, error)
	ListTables() []string
	Delete(table, id string) error
}
