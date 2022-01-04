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
    
    static validate_operatorID(opID) {
        // Check if operator ID is valid
        return ['AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO'].includes(opID);
    }

    static validate_username(username) {
        return username && !/\s/.test(username);
    }

    static validate_username_password(username, password) {
        // Check if given username and password are valid, i.e. if they 
        // contain no whitespace
        return username && password && !/\s/.test(username) && !/\s/.test(password);
    }

    static validate_user_attributes(username, password, type, operatorID) {
        // Check if given user attributes are valid. We accept any string that
        // does not contain whitespace as a valid username or password
        return this.validate_username_password(username, password) && 
               ['operator', 'transportation', 'payment', 'admin'].includes(type) &&
               (operatorID === null || this.validate_operatorID(operatorID));
    }
}


module.exports = aux;