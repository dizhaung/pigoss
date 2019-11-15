const fetchRequest = (url, method, params) => {
  const baseUrl = 'https://bsm.netistate.com:8443/apiservices/m/';
  return new Promise((resolve, reject) => {
    let body = '';
    Object.entries(Object.assign({}, params || {})).forEach(([k, v]) => {
      body += `${k}=${v}&`;
    });
    if (method === 'GET' || method === '' || method === undefined) {
      url += `?${body}`;
      body = '';
    }
    fetch(baseUrl + url, {
      ...{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: method || 'GET',
        body,
      },
    })
      .then(response => response.json())
      .then(res => {
        const {code, data, msg, success} = res;
        if (code === '000000' && success === true) {
          resolve(data);
        } else if (code === '000401') {
          fetchRequest('sessions/login', 'POST', {
            username: 'pigoss',
            password: 'pigoss',
          })
            .then(res => {
              console.log('已登录：', res);
            })
            .catch(err => console.log('登录错误：', err));
        } else {
          console.log('重新登录错误：', msg);
          reject(msg);
        }
      })
      .catch(e => {
        reject(e);
        console.log('错误：', e);
      });
  });
};

export default fetchRequest;
