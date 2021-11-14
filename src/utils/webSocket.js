// const token = localStorage.getItem('token')

export default function initwebSocket(user) {
  const websocketUrl = 'ws://localhost:3000'
  const socket = new WebSocket(`${websocketUrl}`)
  socket.onopen = function() {
    const data = {
      type: 0,
      user_account: user.user_account
    }
    socket.send(JSON.stringify(data))
  }
  return socket
}
