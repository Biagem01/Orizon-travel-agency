<?php
namespace App\Models;

use Core\Database;
use PDO;
use PDOException;

class Country {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->prepare("
            SELECT c.*, COUNT(t.id) as travel_count
            FROM countries c
            LEFT JOIN travels t ON c.id = t.country_id
            GROUP BY c.id
            ORDER BY c.name ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT c.*, COUNT(t.id) as travel_count
            FROM countries c
            LEFT JOIN travels t ON c.id = t.country_id
            WHERE c.id = ?
            GROUP BY c.id
        ");
        $stmt->execute([$id]);
        $country = $stmt->fetch();

        if ($country) {
            $stmt = $this->db->prepare("
                SELECT id, title, seats_available, price, start_date, end_date
                FROM travels
                WHERE country_id = ?
                ORDER BY start_date ASC
            ");
            $stmt->execute([$id]);
            $country['travels'] = $stmt->fetchAll();
        }

        return $country;
    }

    public function create($name) {
        // Check existence
        $stmt = $this->db->prepare("SELECT id FROM countries WHERE name = ?");
        $stmt->execute([$name]);
        if ($stmt->fetch()) return false;

        $stmt = $this->db->prepare("INSERT INTO countries (name) VALUES (?)");
        $stmt->execute([$name]);

        return $this->getById($this->db->lastInsertId());
    }

    public function update($id, $name) {
        // Check conflict
        $stmt = $this->db->prepare("SELECT id FROM countries WHERE name = ? AND id != ?");
        $stmt->execute([$name, $id]);
        if ($stmt->fetch()) return false;

        $stmt = $this->db->prepare("UPDATE countries SET name = ? WHERE id = ?");
        $stmt->execute([$name, $id]);

        return $this->getById($id);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("SELECT COUNT(*) as travel_count FROM travels WHERE country_id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        if ($result['travel_count'] > 0) return false;

        $stmt = $this->db->prepare("DELETE FROM countries WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
