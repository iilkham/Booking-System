<?php
require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$password = 'admin';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "Пароль: admin\n";
echo "Хэш: " . $hash . "\n\n";

$laravelHash = bcrypt('admin');
echo "Laravel bcrypt хэш: " . $laravelHash . "\n";