<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Atividade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AtividadeController extends Controller
{
    // Listar atividades
    public function index()
    {
        return Atividade::all();
    }

    // Cadastrar atividade
    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'capacidade' => 'required|integer|min:1',
        ]);

        $atividade = Atividade::create($dados);

        return response()->json($atividade, 201);
    }

    // Consultar uma atividade
    public function show(Atividade $atividade)
    {
        return $atividade;
    }

    // Atualizar atividade
    public function update(Request $request, Atividade $atividade)
    {
        $dados = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|nullable|string',
            'capacidade' => 'sometimes|required|integer|min:1',
        ]);

        DB::transaction(function () use ($atividade, $dados) {

            $atividade = Atividade::whereKey($atividade->id)
                ->lockForUpdate()
                ->firstOrFail();

            $inscritos = $atividade->inscricoes()->count();

            if (
                isset($dados['capacidade']) &&
                $dados['capacidade'] < $inscritos
            ) {
                throw ValidationException::withMessages([
                    'capacidade' => 'Não é possível definir menos vagas que a quantidade de inscritos.'
                ]);
            }

            $atividade->update($dados);
        });

        return $atividade->fresh();
    }

    // Excluir atividade
    public function destroy(Atividade $atividade)
    {
        if ($atividade->inscricoes()->exists()) {
            return response()->json([
                'mensagem' => 'Não é possível excluir uma atividade que possui inscrições.'
            ], 409);
        }

        $atividade->delete();

        return response()->json([
            'mensagem' => 'Atividade excluída com sucesso.'
        ]);
    }
}
