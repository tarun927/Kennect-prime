document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const startRangeInput = document.getElementById('startRange');
    const endRangeInput = document.getElementById('endRange');
    const resultDiv = document.getElementById('result');

    calculateButton.addEventListener('click', function() {
        const start = parseInt(startRangeInput.value);
        const end = parseInt(endRangeInput.value);

        if (start >= 1 && end >= start) {
            const result = getPrimesInRange(start, end);
            displayResult(result);
        } else {
            alert("Please enter valid range values.");
        }
    });

    function displayResult(result) {
        const primes = result.primes;
        const metrics = result.metrics;

        let resultHTML = `<p>Number of Primes: ${primes.length}</p>`;
        resultHTML += `<p>Prime Numbers: ${primes.join(', ')}</p>`;

        resultHTML += `<button id="detailsButton">Details</button>`;

        resultDiv.innerHTML = resultHTML;

        const detailsButton = document.getElementById('detailsButton');
        detailsButton.addEventListener('click', function() {
            const detailsModal = document.createElement('div');
            detailsModal.classList.add('modal');
            detailsModal.id = 'detailsModal';
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="tabs">
                        <button class="tabButton" onclick="showTab('singleNumberTab')">Single Number Checks</button>
                        <button class="tabButton" onclick="showTab('primeTab')">Prime Checks</button>
                    </div>
                    <div class="tabContent" id="singleNumberTab">${getSingleNumberChecksTable(metrics.singleNumberCheckTimes)}</div>
                    <div class="tabContent" id="primeTab">${getPrimeChecksTable(metrics.primeCheckTimes)}</div>
                </div>
            `;

            document.body.appendChild(detailsModal);

            const close = document.getElementsByClassName('close')[0];
            close.addEventListener('click', function() {
                detailsModal.style.display = "none";
            });

            detailsModal.style.display = "block";
        });
    }

    function getSingleNumberChecksTable(times) {
        let tableHTML = `<table>
                            <tr><th>Number</th><th>Result</th><th>Time in ms</th></tr>`;
        for (let i = 1; i <= times.length; i++) {
            tableHTML += `<tr><td>${i}</td><td>${i % 2 === 0 ? 'Normal' : 'Prime'}</td><td>${times[i - 1]}</td></tr>`;
        }
        tableHTML += `</table>`;
        return tableHTML;
    }

    function getPrimeChecksTable(times) {
        let tableHTML = `<table>
                            <tr><th>Number</th><th>Time in ms</th></tr>`;
        for (let i = 1; i <= times.length; i++) {
            tableHTML += `<tr><td>${i}</td><td>${times[i - 1]}</td></tr>`;
        }
        tableHTML += `</table>`;
        return tableHTML;
    }
});

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

function getPrimesInRange(start, end) {
    let primes = [];
    let singleNumberCheckTimes = [];
    let primeCheckTimes = [];

    const startGetPrimes = performance.now();

    for (let i = start; i <= end; i++) {
        const startSingleCheck = performance.now();
        if (isPrime(i)) {
            primes.push(i);
        }
        const endSingleCheck = performance.now();
        singleNumberCheckTimes.push(endSingleCheck - startSingleCheck);
    }

    const endGetPrimes = performance.now();
    const getPrimesTime = endGetPrimes - startGetPrimes;

    for (let i = 0; i < primes.length; i++) {
        const startPrimeCheck = performance.now();
        isPrime(primes[i]);
        const endPrimeCheck = performance.now();
        primeCheckTimes.push(endPrimeCheck - startPrimeCheck);
    }

    const avgSingleNumberCheckTime = singleNumberCheckTimes.reduce((acc, time) => acc + time, 0) / singleNumberCheckTimes.length;
    const avgPrimeCheckTime = primeCheckTimes.reduce((acc, time) => acc + time, 0) / primeCheckTimes.length;

    return {
        primes: primes,
        metrics: {
            getPrimesTime: getPrimesTime,
            avgSingleNumberCheckTime: avgSingleNumberCheckTime,
            avgPrimeCheckTime: avgPrimeCheckTime,
            singleNumberCheckTimes: singleNumberCheckTimes,
            primeCheckTimes: primeCheckTimes
        }
    };
}


