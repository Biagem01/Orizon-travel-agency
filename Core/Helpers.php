<?php
namespace Core;

class Helpers {
    public static function sendResponse($data, $status = 200) {
        http_response_code($status);
        header("Content-Type: application/json");
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit;
    }

    public static function sendError($message, $status = 400, $type = 'Bad Request') {
        self::sendResponse(['error' => $type, 'message' => $message], $status);
    }

    public static function getJsonInput(array $required = [], array $optional = []) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) self::sendError('Invalid JSON provided');

        $validated = [];

        foreach ($required as $field) {
            if (!isset($input[$field]) || trim($input[$field]) === '') {
                self::sendError("Field '{$field}' is required", 400);
            }
            $validated[$field] = trim($input[$field]);
        }

        foreach ($optional as $field => $default) {
            $validated[$field] = isset($input[$field]) ? trim($input[$field]) : $default;
        }

        return $validated;
    }
}
