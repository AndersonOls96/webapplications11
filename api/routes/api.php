<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipanteController;
use App\Http\Controllers\AtividadeController;
use App\Http\Controllers\InscricaoController;

Route::apiResource('participantes', ParticipanteController::class);
Route::apiResource('atividades', AtividadeController::class);
Route::apiResource('inscricoes', InscricaoController::class);
Route::get('participantes/{participante}/inscricoes',
[InscricaoController::class, 'porParticipante']
);

Route::get(
    'atividades/{atividade}/inscricoes',
    [InscricaoController::class, 'porAtividade']);