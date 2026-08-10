<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Recreate table with nullable columns (SQLite compatible)
        DB::statement('CREATE TABLE payments_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            reference VARCHAR,
            provider_id INTEGER,
            package_id INTEGER,
            amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT "USD",
            method VARCHAR,
            payment_method VARCHAR,
            transaction_id VARCHAR,
            status VARCHAR DEFAULT "pending",
            tier VARCHAR,
            description VARCHAR,
            poll_url TEXT,
            notes TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            paid_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL,
            FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
        )');
        DB::statement('INSERT INTO payments_new SELECT id, user_id, reference, provider_id, package_id, amount, currency, method, payment_method, transaction_id, status, tier, description, poll_url, notes, created_at, updated_at, paid_at FROM payments');
        DB::statement('DROP TABLE payments');
        DB::statement('ALTER TABLE payments_new RENAME TO payments');
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'provider_id')) {
                $table->unsignedBigInteger('provider_id')->nullable(false)->change();
            }
        });
    }
};
