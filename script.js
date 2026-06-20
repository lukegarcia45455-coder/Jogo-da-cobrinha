const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const grid = 20;
const tileCount = canvas.width / grid;

let snake = [
    { x: 10, y: 10 }
];

let food = {
    x: 5,
    y: 5
};

let dx = 1;  // ✅ CORRIGIDO: começa se movendo para a direita
let dy = 0;
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;

    if (key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -1;
    }

    if (key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 1;
    }

    if (key === "ArrowLeft" && dx === 0) {
        dx = -1;
        dy = 0;
    }

    if (key === "ArrowRight" && dx === 0) {
        dx = 1;
        dy = 0;
    }
}

// ✅ CORRIGIDO: Verifica se uma posição é válida (sem cobras)
function isFoodOnSnake(x, y) {
    return snake.some(part => part.x === x && part.y === y);
}

function randomFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * tileCount);
        y = Math.floor(Math.random() * tileCount);
    } while (isFoodOnSnake(x, y));  // ✅ Garante que a comida não aparece sobre a cobra
    
    food.x = x;
    food.y = y;
}

function drawGame() {

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Colisão com a parede
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ) {
        resetGame();
        return;
    }

    // ✅ CORRIGIDO: Colisão com o próprio corpo (começa do índice 1, não 0)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    snake.unshift(head);

    // Comer comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = `Pontuação: ${score}`;
        randomFood();
    } else {
        snake.pop();
    }

    // Limpa tela
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha comida
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * grid,
        food.y * grid,
        grid - 2,
        grid - 2
    );

    // Desenha cobra
    ctx.fillStyle = "#4CAF50";

    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * grid,
            segment.y * grid,
            grid - 2,
            grid - 2
        );
    });
}

function resetGame() {
    alert(`Game Over! Pontuação: ${score}`);

    snake = [{ x: 10, y: 10 }];
    dx = 1;  // ✅ CORRIGIDO: reinicia com direção para direita
    dy = 0;

    score = 0;
    scoreText.textContent = "Pontuação: 0";

    randomFood();
}

setInterval(drawGame, 120);