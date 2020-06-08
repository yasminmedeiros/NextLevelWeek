import Knex from 'knex';

export async function up(knex: Knex) {
    //CRIAR A TABELA
   return knex.schema.createTable('point_itens', table =>{
        table.increments('id').primary();
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');
        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('itens');
    });

}
export async function down(knex:Knex) {
    //VOLTAR ATRÁS (DELETAR A TABELA)
    //FAZ AO CONTRÁRIO QUE SE FAZ NO UP

    return knex.schema.dropTable('point_itens');
}
 