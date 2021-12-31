const moment = require('moment');

class aux {
    static get_current_timestamp() {
        return this.convert_date_object(new Date());
    }

    static convert_date_param(date) {
        // Converts a YYYYMMDD string into a YYYY-MM-DD string
        return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
    }
    
    static convert_date_object(date) {
        // Converts a date object to a datetime string
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
    
    static validate_stationID(stationID) {
        // Check if stationID consists of two capital letters, followed by two digits
        return /^[A-Z]{2}\d{2}$/.test(stationID);
    }
    
    static validate_date(date) {
        // Check if date consists of 8 digits and is valid
        return /^\d{8}$/.test(date) && moment(this.convert_date_param(date)).isValid();
    }
    
    static validate_opID(opID) {
        // Check if operator ID is valid
        return ['AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO'].includes(opID);
    }
}


module.exports = aux;