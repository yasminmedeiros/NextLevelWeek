import Knex from 'knex';

export async function up(knex: Knex) {
    //CRIAR A TABELA
   return knex.schema.createTable('itens', table =>{
        table.increments('id').primary();
        table.string('image_url').notNullable();
        table.string('title').notNullable();
    });

}
export async function down(knex:Knex) {
    //VOLTART ATRÁS (DELETAR A TABELA)
    //FAZ AO CONTRÁRIO QUE SE FAZ NO UP

    return knex.schema.dropTable('itens');
}
 