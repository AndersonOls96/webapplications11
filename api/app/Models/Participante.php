<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Inscricao;

class Participante extends Model
{
    protected $fillable = [
        'nome',
        'email',
        'telefone',
    ];

    public function inscricoes(): HasMany
    {
        return $this->hasMany(Inscricao::class);
    }
}