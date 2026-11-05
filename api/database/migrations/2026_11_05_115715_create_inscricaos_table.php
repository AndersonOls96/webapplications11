<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscricaos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participante_id')->constrained('participantes')->cascadeOnDelete();
            $table->foreignId('atividade_id')->constrained('atividades')->restrictOnDelete();

            $table->timestamps();

            $table->unique([
                'participante_id',
                'atividade_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscricaos');
    }
};
