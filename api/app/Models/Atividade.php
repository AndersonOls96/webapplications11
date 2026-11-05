<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'capacidade',
    ];
    protected $casts = [
        'capacidade'=> 'integer',
    ];

    public function Inscricao():HasMany{
        return $this->HasMany(Inscricao::class);
}
}
