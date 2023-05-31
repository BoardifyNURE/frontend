export default () : string => {
    return localStorage.getItem('accessToken') || ''
}