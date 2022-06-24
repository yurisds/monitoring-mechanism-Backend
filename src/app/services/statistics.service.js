const util = require("./util.service")

const dayjs = require("dayjs")

function get_extract(data) {

    let extract = {
        db_name: data.database,
        create_table: 0,
        drop_table: 0,
        alter_table: 0,
        not_null_constraints: 0,
        primary_key_constraints: 0,
        foreign_key_constraints: 0,
        check_constraints: 0,
        varchar_type: 0,
        text_type: 0,
        integer_type: 0,
        smallint_type: 0,
        bigint_type: 0,
        char_type: 0,
        date_type: 0,
        numeric_type: 0,
        boolean_type: 0,
        worked_0h_3h: 0,
        worked_3h_6h: 0,
        worked_6h_9h: 0,
        worked_9h_12h: 0,
        worked_12h_15h: 0,
        worked_15h_18h: 0,
        worked_18h_21h: 0,
        worked_21h_24h: 0,
        add_columns: 0,
        alter_columns: 0,
        drop_columns: 0,
        add_primary_key: 0,
        add_constraint: 0,
        insert: 0,
        update: 0,
        update_without_where: 0,
        delete: 0,
        delete_without_where: 0,
    }

    data.array.map( (row) => {
        if (['DROP TABLE', 'CREATE TABLE', 'ALTER TABLE'].includes(row.event_name)) {

            const hour = dayjs(row.date_time).hour();
    
            if (hour >= 0 && hour < 3) {
                extract.worked_0h_3h++;
            } else if (hour >= 3 && hour < 6) {
                extract.worked_3h_6h++;
            } else if (hour >= 6 && hour < 9) {
                extract.worked_6h_9h++;
            } else if (hour >= 9 && hour < 12) {
                extract.worked_9h_12h++;
            } else if (hour >= 12 && hour < 15) {
                extract.worked_12h_15h++;
            } else if (hour >= 15 && hour < 18) {
                extract.worked_15h_18h++;
            } else if (hour >= 18 && hour < 21) {
                extract.worked_18h_21h++;
            } else if (hour >= 21 && hour < 24) {
                extract.worked_21h_24h++;
            }
        }
    
        if (row.event_name === 'DROP TABLE') {
    
            extract.drop_table++;
    
        } else if (row.event_name === 'CREATE TABLE') {
            extract.create_table++;
    
    
            extract.not_null_constraints += util.countAllOccurrences(row, 'not null');
            extract.primary_key_constraints += util.countAllOccurrences(row, 'primary key');
            extract.foreign_key_constraints += util.countAllOccurrences(row, 'foreign key');
            extract.check_constraints += util.countAllOccurrences(row, 'check');
            extract.varchar_type += util.countAllOccurrences(row, 'varchar');
            extract.integer_type += util.countAllOccurrences(row, 'integer');
            extract.smallint_type += util.countAllOccurrences(row, 'smallint');
            extract.bigint_type += util.countAllOccurrences(row, 'bigint');
            extract.char_type += util.countAllOccurrences(row, 'char') - util.countAllOccurrences(row, 'varchar');
            extract.numeric_type += util.countAllOccurrences(row, 'numeric');
            extract.text_type += util.countAllOccurrences(row, 'text');
            extract.date_type += util.countAllOccurrences(row, 'date');
            extract.boolean_type += util.countAllOccurrences(row, 'boolean');
    
        } else if (row.event_name === 'ALTER TABLE') {
    
            extract.alter_table++;
    
    
            extract.not_null_constraints += util.countAllOccurrences(row, 'not null');
            extract.primary_key_constraints += util.countAllOccurrences(row, 'primary key');
            extract.foreign_key_constraints += util.countAllOccurrences(row, 'foreign key');
            extract.check_constraints += util.countAllOccurrences(row, 'check');
            extract.varchar_type += util.countAllOccurrences(row, 'varchar');
            extract.integer_type += util.countAllOccurrences(row, 'integer');
            extract.smallint_type += util.countAllOccurrences(row, 'smallint')
            extract.bigint_type += util.countAllOccurrences(row, 'bigint');
            extract.char_type += util.countAllOccurrences(row, 'char') - util.countAllOccurrences(row, 'varchar');
            extract.numeric_type += util.countAllOccurrences(row, 'numeric');
            extract.text_type += util.countAllOccurrences(row, 'text');
            extract.date_type += util.countAllOccurrences(row, 'date');
            extract.boolean_type += util.countAllOccurrences(row, 'boolean');
            extract.add_columns += util.countAllOccurrences(row, 'add column');
            extract.alter_columns += util.countAllOccurrences(row, 'alter column');
            extract.drop_columns += util.countAllOccurrences(row, 'drop column');
            extract.add_primary_key += util.countAllOccurrences(row, 'add primary key');
            extract.add_constraint += util.countAllOccurrences(row, 'add constraint');
    
        } else if (row.event_name === 'INSERT') {
    
            extract.insert++;
    
        } else if (row.event_name === 'UPDATE') {
    
            extract.update++;
    
            update_with_where = util.countAllOccurrences(row, 'where');
    
            if (!update_with_where) {
                extract.update_without_where++;
            }
    
    
        } else if (row.event_name === 'DELETE') {
    
            extract.delete++;
    
            delete_with_where = util.countAllOccurrences(row, 'where');
    
            if (!delete_with_where) {
                extract.delete_without_where++;
            }
    
        }
    })


    extract = {
        ...extract,
        ...getHoursEventsLogsByDatabase(data)
    }

   return extract;
}

const getAllStatistics = async (data) => {

    let allDatabases = [];

    await data.map( (file) => {
        allDatabases.push(get_extract(file));
    })

    allDatabases.sort( (a, b) => {
        if (a.db_name > b.db_name) {
            return 1;
          }
          if (a.db_name < b.db_name) {
            return -1;
          }
          return 0; 
    })

    return allDatabases;
};

const getStatisticsByDatabase = async (data) => {
;
    return get_extract(data)

};

const getHoursEventsLogsByDatabase = (data) => {

    let array = [];

    data.array.map((row) => {

        if(row.event_name !== 'CREATE TRIGGER' && row.event_name !== 'CREATE FUNCTION' && row.event_name !== 'DROP FUNCTION' && row.event_name !== 'GRANT'){
            array.push(dayjs(row.date_time).format("YYYY-MM-DDThh:mm:ss"))
        }
    })

    const set = new Set(array);

    const arr = Array.from(set);

    arr.sort( (a, b) => {
        if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          return 0; 
    })

    let count = 0;
    let last = null;

    arr.forEach( (i) => {

        if(!last) {
            last = i;
            count = 1;
        }else {

            const actual = dayjs(i);
            const auxLast = dayjs(last);

            const diff = actual.diff(auxLast, "minutes", true);

            const totalHours = parseInt(diff / 60);

            if (totalHours >= 1) {
                count++;

            }
            last = i;

        }
    });

    const aux = {
        studySessions: count,
        totalRegisters: array.length,
        realRegisters: set.size,
    }

    return aux;

};

module.exports = {
    getAllStatistics,
    getStatisticsByDatabase,
}