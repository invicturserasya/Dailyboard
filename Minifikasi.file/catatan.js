export function tambahCatatan(a,t){return a.push(t),simpanCatatanStorage(a),a}export function hapusCatatan(a,t){return a.splice(t,1),simpanCatatanStorage(a),a}
