<?php
namespace App\Models;

use Core\Database;
use PDO;

class Travel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        // Qui usi $this->db come PDO per preparare ed eseguire le query
        $where_conditions = [];
        $params = [];

        if (!empty($filters['country_id']) && is_numeric($filters['country_id'])) {
            $where_conditions[] = "t.country_id = ?";
            $params[] = (int)$filters['country_id'];
        }
        if (!empty($filters['seats_available']) && is_numeric($filters['seats_available'])) {
            $where_conditions[] = "t.seats_available >= ?";
            $params[] = (int)$filters['seats_available'];
        }
        if (!empty($filters['min_price']) && is_numeric($filters['min_price'])) {
            $where_conditions[] = "t.price >= ?";
            $params[] = (float)$filters['min_price'];
        }
        if (!empty($filters['max_price']) && is_numeric($filters['max_price'])) {
            $where_conditions[] = "t.price <= ?";
            $params[] = (float)$filters['max_price'];
        }
        if (!empty($filters['start_date'])) {
            $where_conditions[] = "t.start_date >= ?";
            $params[] = $filters['start_date'];
        }

        $where_clause = $where_conditions ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

        $order_by = 'ORDER BY t.start_date ASC, t.created_at DESC';
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'price_asc': $order_by = 'ORDER BY t.price ASC'; break;
                case 'price_desc': $order_by = 'ORDER BY t.price DESC'; break;
                case 'seats_asc': $order_by = 'ORDER BY t.seats_available ASC'; break;
                case 'seats_desc': $order_by = 'ORDER BY t.seats_available DESC'; break;
                case 'name': $order_by = 'ORDER BY t.title ASC'; break;
            }
        }

        $sql = "
            SELECT t.*, c.name as country_name
            FROM travels t
            JOIN countries c ON t.country_id = c.id
            $where_clause
            $order_by
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $travels = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $countSql = "
            SELECT COUNT(*) as total
            FROM travels t
            JOIN countries c ON t.country_id = c.id
            $where_clause
        ";
        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

        return [
            'data' => $travels,
            'count' => count($travels),
            'total' => (int)$total,
        ];
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT t.*, c.name as country_name
            FROM travels t
            JOIN countries c ON t.country_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);
        $travel = $stmt->fetch(PDO::FETCH_ASSOC);
        return $travel ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO travels (country_id, seats_available, title, description, price, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['country_id'],
            $data['seats_available'],
            $data['title'],
            $data['description'] ?? null,
            $data['price'] ?? null,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = [];

        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $params[] = $value;
        }
        $params[] = $id;

        $sql = "UPDATE travels SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM travels WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function exists(int $id): bool {
        $stmt = $this->db->prepare("SELECT 1 FROM travels WHERE id = ?");
        $stmt->execute([$id]);
        return (bool)$stmt->fetchColumn();
    }
}
