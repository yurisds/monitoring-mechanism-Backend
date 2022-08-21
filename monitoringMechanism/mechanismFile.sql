CREATE SCHEMA auditTable;

CREATE TABLE auditTable.TAB_EVENT_LOGS(
	id serial primary key,
  	DATE_TIME TIMESTAMP NOT NULL,
  	EVENT_NAME TEXT NOT NULL,
	table_name TEXT,
  	row_old TEXT,
	row_new TEXT,
    current_query TEXT
);


CREATE OR REPLACE FUNCTION auditTable.FN_LOG_EVENT()
  RETURNS EVENT_TRIGGER
  LANGUAGE PLPGSQL
  AS 
  $main$
  BEGIN

    if TG_TAG != 'CREATE TABLE' and TG_TAG != 'DROP TABLE' and TG_TAG != 'ALTER TABLE' then 
        INSERT INTO auditTable.TAB_EVENT_LOGS(DATE_TIME,EVENT_NAME, table_name, row_old, row_new, current_query)
      VALUES(NOW(),TG_TAG, null, null, null, null);
    end if;
	END
  $main$;


CREATE EVENT TRIGGER TRG_LOG_EVENT ON DDL_COMMAND_START
  EXECUTE PROCEDURE auditTable.FN_LOG_EVENT();


	
CREATE OR REPLACE FUNCTION auditTable.create_tg_fn()
        RETURNS event_trigger LANGUAGE plpgsql AS $f$
DECLARE
    obj record;
	name_table varchar(255);

BEGIN

  FOR obj IN SELECT current_query() as current_query, * FROM pg_event_trigger_ddl_commands() where object_type = 'table' and command_tag = 'CREATE TABLE'
  LOOP
  
	name_table := obj.object_identity::regclass;
	
    INSERT INTO auditTable.TAB_EVENT_LOGS(DATE_TIME,EVENT_NAME, table_name, row_old, row_new, current_query)
      VALUES(NOW(), obj.command_tag, name_table, null, null, obj.current_query);
	
  	execute format('create function %I() returns trigger as $$ begin 
      IF TG_OP = %L THEN 
      INSERT INTO auditTable.tab_event_logs (date_time, event_name, table_name, row_old, row_new, current_query) VALUES (NOW(), TG_OP, %L, null, NEW, current_query());
      ELSIF TG_OP = %L THEN 
      INSERT INTO auditTable.tab_event_logs (date_time, event_name, table_name, row_old, row_new, current_query) VALUES (NOW(), TG_OP, %L, OLD, NEW, current_query());
      ELSE
      INSERT INTO auditTable.tab_event_logs (date_time, event_name, table_name, row_old, row_new, current_query) VALUES (NOW(), TG_OP, %L, OLD, null, current_query());
      END IF; return null; end $$ language $l$plpgsql$l$', name_table, 'INSERT', name_table, 'UPDATE', name_table, name_table);

	execute format ('CREATE TRIGGER teste AFTER DELETE or INSERT or UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE %I();', name_table, name_table);
	

  END LOOP;
END
$f$
;


CREATE EVENT TRIGGER create_tg_tg
   ON ddl_command_end
WHEN TAG IN ('CREATE TABLE')
   EXECUTE PROCEDURE auditTable.create_tg_fn();


CREATE OR REPLACE FUNCTION auditTable.drop_tg_fn()
        RETURNS event_trigger LANGUAGE plpgsql AS $f$
DECLARE
    obj record;
	name_table varchar(255);

BEGIN

  FOR obj IN SELECT current_query() as current_query, * FROM pg_event_trigger_dropped_objects() where object_type = 'table'
  LOOP
	
	name_table := obj.object_name;
	
	INSERT INTO auditTable.TAB_EVENT_LOGS(DATE_TIME,EVENT_NAME, table_name, row_old, row_new, current_query)
      VALUES(NOW(), 'DROP TABLE', name_table, null, null, obj.current_query);

  	execute format('drop function if exists %I() CASCADE;', name_table);


  END LOOP;
END
$f$
;

CREATE EVENT TRIGGER drop_tg_tg
   ON sql_drop
   EXECUTE PROCEDURE auditTable.drop_tg_fn();


CREATE OR REPLACE FUNCTION auditTable.alter_tg_fn()
        RETURNS event_trigger LANGUAGE plpgsql AS $f$
DECLARE
    obj record;
	name_table varchar(255);

BEGIN

  FOR obj IN SELECT current_query() as current_query, * FROM pg_event_trigger_ddl_commands() where object_type = 'table' and command_tag = 'ALTER TABLE'
  LOOP
  
	name_table := obj.object_identity::regclass;
	
    INSERT INTO auditTable.TAB_EVENT_LOGS(DATE_TIME,EVENT_NAME, table_name, row_old, row_new, current_query)
      VALUES(NOW(), obj.command_tag, name_table, null, null, obj.current_query);

  END LOOP;
END
$f$
;


CREATE EVENT TRIGGER alter_tg_tg
   ON ddl_command_end
WHEN TAG IN ('ALTER TABLE')
   EXECUTE PROCEDURE auditTable.alter_tg_fn();