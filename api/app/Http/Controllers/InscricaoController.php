<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Inscricao;
use App\Models\Atividade;
use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


class InscricaoController extends Controller

{
    // Listar inscrições
    public function index(Request $request)
    {
        $dados = $request->validate([
            'participante_id' => 'sometimes|integer|exists:participantes,id',
            'atividade_id' => 'sometimes|integer|exists:atividades,id',
        ]);

        return Inscricao::with(['participante', 'atividade'])
            ->when(
                $dados['participante_id'] ?? null,
                fn ($query, $id) => $query->where('participante_id', $id)
            )
            ->when(
                $dados['atividade_id'] ?? null,
                fn ($query, $id) => $query->where('atividade_id', $id)
            )
            ->get();
    }

    // Realizar inscrição
    public function store(Request $request)
    {
        $dados = $request->validate([
            'participante_id' => 'required|exists:participantes,id',
            'atividade_id' => 'required|exists:atividades,id',
        ]);

        $inscricao = DB::transaction(function () use ($dados) {

            $atividade = Atividade::whereKey($dados['atividade_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Verificar inscrição duplicada
            $duplicada = Inscricao::where('participante_id', $dados['participante_id'])
                ->where('atividade_id', $dados['atividade_id'])
                ->exists();

            if ($duplicada) {
                throw ValidationException::withMessages([
                    'participante_id' => 'Este participante já está inscrito nesta atividade.'
                ]);
            }

            // Verificar disponibilidade de vagas
            if ($atividade->inscricoes()->count() >= $atividade->capacidade) {
                throw ValidationException::withMessages([
                    'atividade_id' => 'Não existem vagas disponíveis nesta atividade.'
                ]);
            }

            return Inscricao::create($dados);
        });

        return response()->json($inscricao, 201);
    }

    // Consultar uma inscrição
    public function show(Inscricao $inscricao)
    {
        return $inscricao->load(['participante', 'atividade']);
    }

    // Atualizar inscrição
    public function update(Request $request, Inscricao $inscricao)
    {
        $dados = $request->validate([
            'participante_id' => 'sometimes|required|exists:participantes,id',
            'atividade_id' => 'sometimes|required|exists:atividades,id',
        ]);

        $inscricao = DB::transaction(function () use ($inscricao, $dados) {

            $inscricao = Inscricao::whereKey($inscricao->id)
                ->lockForUpdate()
                ->firstOrFail();

            $participanteId = $dados['participante_id']
                ?? $inscricao->participante_id;

            $atividadeId = $dados['atividade_id']
                ?? $inscricao->atividade_id;

            $atividade = Atividade::whereKey($atividadeId)
                ->lockForUpdate()
                ->firstOrFail();

            // Verificar duplicidade
            $duplicada = Inscricao::where('participante_id', $participanteId)
                ->where('atividade_id', $atividadeId)
                ->where('id', '!=', $inscricao->id)
                ->exists();

            if ($duplicada) {
                throw ValidationException::withMessages([
                    'participante_id' => 'Este participante já está inscrito nesta atividade.'
                ]);
            }

            // Verificar vagas se a atividade foi alterada
            if (
                $atividadeId != $inscricao->atividade_id &&
                $atividade->inscricoes()->count() >= $atividade->capacidade
            ) {
                throw ValidationException::withMessages([
                    'atividade_id' => 'Não existem vagas disponíveis nesta atividade.'
                ]);
            }

            $inscricao->update([
                'participante_id' => $participanteId,
                'atividade_id' => $atividadeId,
            ]);

            return $inscricao;
        });

        return $inscricao->load(['participante', 'atividade']);
    }

    // Cancelar inscrição
    public function destroy(Inscricao $inscricao)
    {
        $inscricao->delete();

        return response()->json([
            'mensagem' => 'Inscrição cancelada com sucesso.'
        ]);
    }

    // Consultar inscrições de um participante
    public function porParticipante(Participante $participante)
    {
        return $participante->inscricoes()
            ->with('atividade')
            ->get();
    }

    // Consultar inscritos de uma atividade
    public function porAtividade(Atividade $atividade)
    {
        return $atividade->inscricoes()
            ->with('participante')
            ->get();
    }
}
