<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ParticipanteController extends Controller
{
    // Listar participantes
    public function index()
    {
        return Participante::all();
    }

    // Cadastrar participante
    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:participantes,email',
            'telefone' => 'required|string|max:15',
        ]);

        $participante = Participante::create($dados);

        return response()->json($participante, 201);
    }

    // Consultar um participante
    public function show(Participante $participante)
    {
        return $participante;
    }

    // Atualizar participante
    public function update(Request $request, Participante $participante)
    {
        $dados = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
            'telefone' => 'sometimes|required|string|max:15',    
                Rule::unique('participantes', 'email', 'telefone')
                    ->ignore($participante->id),
           
            ],
        ]);

        $participante->update($dados);

        return $participante;
    }

    // Excluir participante
    public function destroy(Participante $participante)
    {
        $participante->delete();

        return response()->json([
            'mensagem' => 'Participante excluído com sucesso.'
        ]);
    }
}