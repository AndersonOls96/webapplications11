<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Inscricao;
use Illuminate\Database\Eloquent\Relations\HasMany;



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

    public function inscricoes():HasMany{
        return $this->hasMany(Inscricao::class);
}
}
