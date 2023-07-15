import moment from 'moment'

export const formatDate = (fecha) => {
    const hoyMes = moment(fecha)

    return hoyMes.format('MMM D, YYYY')
} 