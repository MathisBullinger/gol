const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const grid = Array(300).fill().map(() => Array(300).fill(false))
let center
let cellSize

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
  cellSize = Math.max(canvas.width, canvas.height) / grid.length
  center = [grid[0].length / 2, grid.length / 2]
}
resize()
window.addEventListener('resize', resize)

for (const row of grid) for (let i = 0; i < row.length; i++) row[i] = Math.random() > .8

function render() {
  const x0 = canvas.width / 2 - center[0] * cellSize 
  const y0 = canvas.height / 2 - center[1] * cellSize 

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000'

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!grid[y][x]) continue
      ctx.fillRect(x0 + x * cellSize, y0 + y * cellSize, cellSize, cellSize)
    }
  }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function update() {
  const toggle = []

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let c = 0
      for (let i = 0; i < 8; i++) if (grid[y + (2 - clamp(Math.abs(i - 5), 1, 3))]?.[x + (2 - clamp(Math.abs(i - 3), 1, 3))]) c++
      if (!grid[y][x] ? c === 3 : c < 2 || c > 3) toggle.push(x, y)
    }
  }

  for (let i = 0; i < toggle.length; i += 2) grid[toggle[i + 1]][toggle[i]] = !grid[toggle[i + 1]][toggle[i]]
}

let interval = 100

function step() {
  const t0 = performance.now()

  update()
  render()

  const delay = interval - (performance.now() - t0)
  if (delay > 0) setTimeout(step, delay)
  else {
    console.warn('stalled')
    step()
  }
}

render()
setTimeout(step, interval)
