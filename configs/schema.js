import { integer, pgTable, serial, text, varchar, boolean } from "drizzle-orm/pg-core";

export const JsonForms = pgTable('jsonForms', {
  id: serial('id').primaryKey(),
  jsonform: text('jsonform').notNull(),
  theme: varchar('theme'),
  background: varchar('background'),
  style: varchar('style'),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
  enabledSignIn: boolean('enabledSignIn').default(false) 
});


export const userResponses = pgTable('userResponses', {
  id: serial('id').primaryKey(),
  jsonResponse: text('jsonResponse').notNull(),
  createdBy: varchar('createdBy').default('anonymous').notNull(),
  createdAt: varchar('createdAt').notNull(),
  formRef: integer('formRef').references(() => JsonForms.id)
});