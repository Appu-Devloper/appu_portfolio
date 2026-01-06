const practiceApp = document.querySelector('[data-practice-app]');

if (practiceApp) {
  const gridEl = document.getElementById('practice-grid');
  const countEl = document.getElementById('practice-count');
  const searchInput = document.getElementById('practice-search');
  const codeEl = document.getElementById('code-block');
  const titleEl = document.getElementById('program-title');
  const noteEl = document.getElementById('program-note');
  const tagEl = document.getElementById('program-tag');
  const inputEl = document.getElementById('input-fields');
  const consoleEl = document.getElementById('console');
  const stepListEl = document.getElementById('step-list');
  const stepStatusEl = document.getElementById('step-status');
  const stepCountEl = document.getElementById('step-count');
  const currentStepTextEl = document.getElementById('current-step-text');
  const copyCodeBtn = document.getElementById('copy-code');

  const runBtn = document.getElementById('run-btn');
  const stepBtn = document.getElementById('step-btn');
  const autoBtn = document.getElementById('auto-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  const programs = [
    {
      id: 'armstrong',
      file: 'armstrong.c',
      note: 'Check whether a number is an Armstrong number.',
      updated: '',
      inputs: [{ name: 'n', label: 'Number', type: 'number', placeholder: '153', defaultValue: '153' }],
      code: `#include <stdio.h>\n\n// Check if a number is an Armstrong number.\nint main() {\n  int n, temp, digit, sum = 0;\n\n  // Read input number.\n  scanf(\"%d\", &n);\n  temp = n;\n\n  // Process each digit and sum cubes.\n  while (temp > 0) {\n    digit = temp % 10;\n    sum += digit * digit * digit;\n    temp /= 10;\n  }\n\n  // Compare computed sum with original number.\n  if (sum == n) printf(\"Armstrong\");\n  else printf(\"Not Armstrong\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 153);
        const digits = String(Math.abs(n)).split('').map(Number);
        let sum = 0;
        const steps = [];
      steps.push({ text: `Read input n = ${n}.`, line: lineMap.input });
        digits.forEach((digit) => {
          const cube = digit * digit * digit;
          sum += cube;
          steps.push({
            text: `Take digit ${digit}, cube it to ${cube}, add to sum = ${sum}.`,
            line: lineMap.loopBody
          });
        });
        const result = sum === Math.abs(n) ? 'Armstrong' : 'Not Armstrong';
        steps.push({ text: `Compare sum (${sum}) with original n (${n}).`, line: lineMap.result });
        return { steps, output: `Sum = ${sum}. ${n} is ${result}.` };
      },
      lineMatches: {
        input: 'scanf("%d", &n);',
        loopBody: 'digit = temp % 10;',
        result: 'if (sum == n) printf("Armstrong");'
      }
    },
    {
      id: 'arraySearch',
      file: 'arraySearch.c',
      note: 'Linear search for a target in an array.',
      updated: '',
      inputs: [
        { name: 'array', label: 'Array', type: 'list', placeholder: '3, 7, 2, 9, 5', defaultValue: '3,7,2,9,5' },
        { name: 'target', label: 'Target', type: 'number', placeholder: '9', defaultValue: '9' }
      ],
      code: `#include <stdio.h>\n\n// Linear search in a fixed-size array.\nint main() {\n  int a[5], key, i;\n\n  // Read array values.\n  for (i = 0; i < 5; i++) scanf(\"%d\", &a[i]);\n\n  // Read target value.\n  scanf(\"%d\", &key);\n\n  // Scan each element to find a match.\n  for (i = 0; i < 5; i++) {\n    if (a[i] == key) {\n      printf(\"Found at %d\", i);\n      return 0;\n    }\n  }\n  printf(\"Not found\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const arr = parseList(values.array, [3, 7, 2, 9, 5]);
        const target = parseNumber(values.target, 9);
        const steps = [];
      steps.push({ text: `Read target value = ${target}.`, line: lineMap.input });
        let foundIndex = -1;
        arr.forEach((val, idx) => {
          steps.push({
            text: `Check index ${idx}: value ${val} ${val === target ? 'matches the target' : 'does not match'}.`,
            line: lineMap.loop
          });
          if (val === target && foundIndex === -1) {
            foundIndex = idx;
          }
        });
        const output = foundIndex >= 0 ? `Found ${target} at index ${foundIndex}.` : `${target} not found.`;
        return { steps, output };
      },
      lineMatches: {
        input: 'scanf("%d", &key);',
        loop: 'for (i = 0; i < 5; i++) {'
      }
    },
    {
      id: 'average',
      file: 'average.c',
      note: 'Compute the average of a list of numbers.',
      updated: '',
      inputs: [{ name: 'numbers', label: 'Numbers', type: 'list', placeholder: '10, 20, 30', defaultValue: '10,20,30' }],
      code: `#include <stdio.h>\n\n// Compute the average of N numbers.\nint main() {\n  int n, i;\n  float sum = 0, val;\n\n  // Read how many numbers.\n  scanf(\"%d\", &n);\n\n  // Read each value and accumulate sum.\n  for (i = 0; i < n; i++) {\n    scanf(\"%f\", &val);\n    sum += val;\n  }\n\n  // Compute and print average.\n  printf(\"Average = %.2f\", sum / n);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const nums = parseList(values.numbers, [10, 20, 30]);
        const steps = [];
        let sum = 0;
        steps.push({ text: `Read count = ${nums.length} values.`, line: lineMap.input });
        nums.forEach((val, idx) => {
          sum += val;
          steps.push({ text: `Add ${val} to sum -> ${sum}.`, line: lineMap.loopBody });
        });
        const avg = nums.length ? sum / nums.length : 0;
        steps.push({ text: `Divide sum by count to get average = ${avg.toFixed(2)}.`, line: lineMap.result });
        return { steps, output: `Average = ${avg.toFixed(2)}` };
      },
      lineMatches: {
        input: 'scanf("%d", &n);',
        loopBody: 'sum += val;',
        result: 'printf("Average = %.2f", sum / n);'
      }
    },
    {
      id: 'binarySearch',
      file: 'binarySearch.c',
      note: 'Binary search for a target in a sorted array.',
      updated: '',
      inputs: [
        { name: 'array', label: 'Sorted array', type: 'list', placeholder: '2, 4, 6, 8, 10', defaultValue: '2,4,6,8,10' },
        { name: 'target', label: 'Target', type: 'number', placeholder: '8', defaultValue: '8' }
      ],
      code: `#include <stdio.h>\n\n// Binary search in a sorted array.\nint main() {\n  int a[10], key, low = 0, high = 9;\n\n  // Read sorted array.\n  for (int i = 0; i < 10; i++) scanf(\"%d\", &a[i]);\n\n  // Read target value.\n  scanf(\"%d\", &key);\n\n  // Repeatedly divide search range in half.\n  while (low <= high) {\n    int mid = (low + high) / 2;\n    if (a[mid] == key) {\n      printf(\"Found\");\n      return 0;\n    } else if (a[mid] < key) {\n      low = mid + 1;\n    } else {\n      high = mid - 1;\n    }\n  }\n  printf(\"Not found\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const arr = parseList(values.array, [2, 4, 6, 8, 10]);
        const target = parseNumber(values.target, 8);
        let low = 0;
        let high = arr.length - 1;
        const steps = [];
        let found = false;
        steps.push({ text: `Read target value = ${target}.`, line: lineMap.input });
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          steps.push({
            text: `Check middle index ${mid}: value ${arr[mid]} (low=${low}, high=${high}).`,
            line: lineMap.loop
          });
          if (arr[mid] === target) {
            found = true;
            break;
          }
          if (arr[mid] < target) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return { steps, output: found ? `Found ${target}.` : `${target} not found.` };
      },
      lineMatches: {
        input: 'scanf("%d", &key);',
        loop: 'while (low <= high) {'
      }
    },
    {
      id: 'bubbleSort',
      file: 'bubbleSort.c',
      note: 'Sort an array using bubble sort.',
      updated: '',
      inputs: [{ name: 'array', label: 'Array', type: 'list', placeholder: '5, 1, 4, 2', defaultValue: '5,1,4,2' }],
      code: `#include <stdio.h>\n\n// Sort an array using bubble sort.\nint main() {\n  int a[5], i, j, temp;\n\n  // Read array values.\n  for (i = 0; i < 5; i++) scanf(\"%d\", &a[i]);\n\n  // Bubble up the largest values to the end.\n  for (i = 0; i < 5; i++) {\n    for (j = 0; j < 4 - i; j++) {\n      if (a[j] > a[j + 1]) {\n        temp = a[j];\n        a[j] = a[j + 1];\n        a[j + 1] = temp;\n      }\n    }\n  }\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const arr = parseList(values.array, [5, 1, 4, 2]);
        const steps = [];
        const data = arr.slice();
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data.length - 1 - i; j++) {
            steps.push({ text: `Compare ${data[j]} and ${data[j + 1]}.`, line: lineMap.loop });
            if (data[j] > data[j + 1]) {
              const temp = data[j];
              data[j] = data[j + 1];
              data[j + 1] = temp;
              steps.push({ text: `Swap to keep order -> ${data.join(', ')}.`, line: lineMap.swap });
            }
          }
        }
        return { steps, output: `Sorted: ${data.join(', ')}` };
      },
      lineMatches: {
        loop: 'if (a[j] > a[j + 1]) {',
        swap: 'a[j] = a[j + 1];'
      }
    },
    {
      id: 'evenorodd',
      file: 'evenorodd.c',
      note: 'Check whether a number is even or odd.',
      updated: '',
      inputs: [{ name: 'n', label: 'Number', type: 'number', placeholder: '12', defaultValue: '12' }],
      code: `#include <stdio.h>\n\n// Check if a number is even or odd.\nint main() {\n  int n;\n\n  // Read input.\n  scanf(\"%d\", &n);\n\n  // Use remainder to decide parity.\n  if (n % 2 == 0) printf(\"Even\");\n  else printf(\"Odd\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 12);
        const steps = [{ text: `Compute ${n} % 2 = ${n % 2} to decide even/odd.`, line: lineMap.cond }];
        return { steps, output: n % 2 === 0 ? 'Even' : 'Odd' };
      },
      lineMatches: {
        cond: 'if (n % 2 == 0) printf("Even");'
      }
    },
    {
      id: 'factorial',
      file: 'factorial.c',
      note: 'Compute factorial of a number using a loop.',
      updated: '',
      inputs: [{ name: 'n', label: 'Number', type: 'number', placeholder: '5', defaultValue: '5' }],
      code: `#include <stdio.h>\n\n// Compute factorial of a number.\nint main() {\n  int n, i;\n  long long fact = 1;\n\n  // Read input.\n  scanf(\"%d\", &n);\n\n  // Multiply 1..n.\n  for (i = 1; i <= n; i++) {\n    fact *= i;\n  }\n\n  // Print result.\n  printf(\"%lld\", fact);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 5);
        const steps = [];
        let fact = 1;
        for (let i = 1; i <= n; i++) {
          fact *= i;
          steps.push({ text: `Multiply by ${i}: factorial = ${fact}.`, line: lineMap.loop });
        }
        return { steps, output: `Factorial = ${fact}` };
      },
      lineMatches: {
        loop: 'for (i = 1; i <= n; i++) {'
      }
    },
    {
      id: 'fibonacci',
      file: 'fibonacci.c',
      note: 'Generate the Fibonacci series.',
      updated: '',
      inputs: [{ name: 'n', label: 'Terms', type: 'number', placeholder: '6', defaultValue: '6' }],
      code: `#include <stdio.h>\n\n// Generate the Fibonacci series.\nint main() {\n  int n, a = 0, b = 1, i;\n\n  // Read number of terms.\n  scanf(\"%d\", &n);\n\n  // Print each term and update values.\n  for (i = 0; i < n; i++) {\n    printf(\"%d \", a);\n    int next = a + b;\n    a = b;\n    b = next;\n  }\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 6);
        let a = 0;
        let b = 1;
        const steps = [];
        const series = [];
        for (let i = 0; i < n; i++) {
          series.push(a);
          steps.push({ text: `Output ${a}, next term = ${a + b}.`, line: lineMap.loop });
          const next = a + b;
          a = b;
          b = next;
        }
        return { steps, output: `Series: ${series.join(', ')}` };
      },
      lineMatches: {
        loop: 'for (i = 0; i < n; i++) {'
      }
    },
    {
      id: 'gcd',
      file: 'gcd.c',
      note: 'Find GCD using the Euclidean algorithm.',
      updated: '',
      inputs: [
        { name: 'a', label: 'A', type: 'number', placeholder: '54', defaultValue: '54' },
        { name: 'b', label: 'B', type: 'number', placeholder: '24', defaultValue: '24' }
      ],
      code: `#include <stdio.h>\n\n// Compute GCD using Euclid's algorithm.\nint main() {\n  int a, b;\n\n  // Read two numbers.\n  scanf(\"%d%d\", &a, &b);\n\n  // Repeat until remainder is zero.\n  while (b != 0) {\n    int t = b;\n    b = a % b;\n    a = t;\n  }\n\n  // Final a is GCD.\n  printf(\"%d\", a);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        let a = parseNumber(values.a, 54);
        let b = parseNumber(values.b, 24);
        const steps = [];
        while (b !== 0) {
          steps.push({ text: `Compute a % b = ${a % b} with a=${a}, b=${b}.`, line: lineMap.loop });
          const t = b;
          b = a % b;
          a = t;
        }
        return { steps, output: `GCD = ${a}` };
      },
      lineMatches: {
        loop: 'while (b != 0) {'
      }
    },
    {
      id: 'greatestof3',
      file: 'greatestof3.c',
      note: 'Find the greatest of three numbers.',
      updated: '',
      inputs: [
        { name: 'a', label: 'A', type: 'number', placeholder: '8', defaultValue: '8' },
        { name: 'b', label: 'B', type: 'number', placeholder: '15', defaultValue: '15' },
        { name: 'c', label: 'C', type: 'number', placeholder: '3', defaultValue: '3' }
      ],
      code: `#include <stdio.h>\n\n// Find the greatest of three numbers.\nint main() {\n  int a, b, c;\n\n  // Read three inputs.\n  scanf(\"%d%d%d\", &a, &b, &c);\n\n  // Compare and print the largest.\n  if (a >= b && a >= c) printf(\"%d\", a);\n  else if (b >= a && b >= c) printf(\"%d\", b);\n  else printf(\"%d\", c);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const a = parseNumber(values.a, 8);
        const b = parseNumber(values.b, 15);
        const c = parseNumber(values.c, 3);
        const steps = [
          { text: `Compare a=${a}, b=${b}, c=${c} to find the largest.`, line: lineMap.cond },
          { text: `Largest value is ${Math.max(a, b, c)}.`, line: lineMap.result }
        ];
        return { steps, output: `Greatest = ${Math.max(a, b, c)}` };
      },
      lineMatches: {
        cond: 'if (a >= b && a >= c) printf("%d", a);',
        result: 'else printf("%d", c);'
      }
    },
    {
      id: 'largest',
      file: 'largest.c',
      note: 'Find the largest number in a list.',
      updated: '',
      inputs: [{ name: 'numbers', label: 'Numbers', type: 'list', placeholder: '3, 19, 4, 7', defaultValue: '3,19,4,7' }],
      code: `#include <stdio.h>\n\n// Find the largest number in a list.\nint main() {\n  int n, i, max;\n\n  // Read count.\n  scanf(\"%d\", &n);\n\n  // Read each value and track max.\n  for (i = 0; i < n; i++) {\n    int val;\n    scanf(\"%d\", &val);\n    if (i == 0 || val > max) max = val;\n  }\n\n  // Print largest value.\n  printf(\"%d\", max);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const nums = parseList(values.numbers, [3, 19, 4, 7]);
        const steps = [];
        let max = null;
        nums.forEach((val) => {
          if (max === null || val > max) {
            max = val;
            steps.push({ text: `Update max to ${max}.`, line: lineMap.cond });
          } else {
            steps.push({ text: `Keep max as ${max}.`, line: lineMap.cond });
          }
        });
        return { steps, output: `Largest = ${max ?? 0}` };
      },
      lineMatches: {
        cond: 'if (i == 0 || val > max) max = val;'
      }
    },
    {
      id: 'leap',
      file: 'leap.c',
      note: 'Check whether a year is a leap year.',
      updated: '',
      inputs: [{ name: 'year', label: 'Year', type: 'number', placeholder: '2024', defaultValue: '2024' }],
      code: `#include <stdio.h>\n\n// Check if a year is a leap year.\nint main() {\n  int year;\n\n  // Read input year.\n  scanf(\"%d\", &year);\n\n  // Leap year rules.\n  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)\n    printf(\"Leap year\");\n  else\n    printf(\"Not leap year\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const year = parseNumber(values.year, 2024);
        const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const steps = [
          { text: `Check rules: %4=${year % 4}, %100=${year % 100}, %400=${year % 400}.`, line: lineMap.cond }
        ];
        return { steps, output: leap ? 'Leap year' : 'Not leap year' };
      },
      lineMatches: {
        cond: 'if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)'
      }
    },
    {
      id: 'lenString',
      file: 'lenString.c',
      note: 'Find the length of a string.',
      updated: '',
      inputs: [{ name: 'text', label: 'Text', type: 'text', placeholder: 'hello', defaultValue: 'hello' }],
      code: `#include <stdio.h>\n\n// Find the length of a string manually.\nint main() {\n  char s[100];\n  int len = 0;\n\n  // Read input string.\n  scanf(\"%s\", s);\n\n  // Count characters until null terminator.\n  while (s[len] != '\\0') len++;\n\n  printf(\"%d\", len);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const text = parseText(values.text, 'hello');
        const steps = text.split('').map((ch, idx) => ({
          text: `Count character at index ${idx}: '${ch}'.`,
          line: lineMap.loop
        }));
        return { steps, output: `Length = ${text.length}` };
      },
      lineMatches: {
        loop: "while (s[len] != '\\0') len++;"
      }
    },
    {
      id: 'lowertoupper',
      file: 'lowertoupper.c',
      note: 'Convert lowercase letters to uppercase.',
      updated: '',
      inputs: [{ name: 'text', label: 'Text', type: 'text', placeholder: 'appu', defaultValue: 'appu' }],
      code: `#include <stdio.h>\n\n// Convert lowercase letters to uppercase.\nint main() {\n  char s[100];\n\n  // Read input string.\n  scanf(\"%s\", s);\n\n  // Walk each character and convert if needed.\n  for (int i = 0; s[i] != '\\0'; i++) {\n    if (s[i] >= 'a' && s[i] <= 'z') s[i] = s[i] - 32;\n  }\n\n  printf(\"%s\", s);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const text = parseText(values.text, 'appu');
        const steps = [];
        let out = '';
        for (const ch of text) {
          const upper = ch >= 'a' && ch <= 'z' ? ch.toUpperCase() : ch;
          steps.push({ text: `Convert '${ch}' to '${upper}'.`, line: lineMap.loop });
          out += upper;
        }
        return { steps, output: `Result = ${out}` };
      },
      lineMatches: {
        loop: "for (int i = 0; s[i] != '\\0'; i++) {"
      }
    },
    {
      id: 'palindrome',
      file: 'palindrome.c',
      note: 'Check whether a string is a palindrome.',
      updated: '',
      inputs: [{ name: 'text', label: 'Text', type: 'text', placeholder: 'madam', defaultValue: 'madam' }],
      code: `#include <stdio.h>\n#include <string.h>\n\n// Check if a string reads the same forward and backward.\nint main() {\n  char s[100];\n\n  // Read input string.\n  scanf(\"%s\", s);\n\n  // Compare from both ends.\n  int i = 0, j = strlen(s) - 1;\n  while (i < j) {\n    if (s[i] != s[j]) {\n      printf(\"Not palindrome\");\n      return 0;\n    }\n    i++;\n    j--;\n  }\n  printf(\"Palindrome\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const text = parseText(values.text, 'madam');
        const steps = [];
        let i = 0;
        let j = text.length - 1;
        let ok = true;
        while (i < j) {
          steps.push({ text: `Compare '${text[i]}' with '${text[j]}'.`, line: lineMap.loop });
          if (text[i] !== text[j]) {
            ok = false;
            break;
          }
          i++;
          j--;
        }
        return { steps, output: ok ? 'Palindrome' : 'Not palindrome' };
      },
      lineMatches: {
        loop: 'while (i < j) {'
      }
    },
    {
      id: 'prime',
      file: 'prime.c',
      note: 'Check whether a number is prime.',
      updated: '',
      inputs: [{ name: 'n', label: 'Number', type: 'number', placeholder: '29', defaultValue: '29' }],
      code: `#include <stdio.h>\n\n// Check if a number is prime.\nint main() {\n  int n, i;\n\n  // Read input.\n  scanf(\"%d\", &n);\n\n  // Handle small numbers.\n  if (n < 2) {\n    printf(\"Not prime\");\n    return 0;\n  }\n\n  // Try dividing from 2 to sqrt(n).\n  for (i = 2; i * i <= n; i++) {\n    if (n % i == 0) {\n      printf(\"Not prime\");\n      return 0;\n    }\n  }\n  printf(\"Prime\");\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 29);
        const steps = [];
        if (n < 2) {
          steps.push({ text: 'n < 2, so it is not prime.', line: lineMap.cond });
          return { steps, output: 'Not prime' };
        }
        let prime = true;
        for (let i = 2; i * i <= n; i++) {
          steps.push({ text: `Test divisor ${i}: ${n} % ${i} = ${n % i}.`, line: lineMap.loop });
          if (n % i === 0) {
            prime = false;
            break;
          }
        }
        return { steps, output: prime ? 'Prime' : 'Not prime' };
      },
      lineMatches: {
        cond: 'if (n < 2) {',
        loop: 'for (i = 2; i * i <= n; i++) {'
      }
    },
    {
      id: 'reverse',
      file: 'reverse.c',
      note: 'Reverse a string.',
      updated: '',
      inputs: [{ name: 'text', label: 'Text', type: 'text', placeholder: 'hello', defaultValue: 'hello' }],
      code: `#include <stdio.h>\n#include <string.h>\n\n// Reverse a string by printing characters from the end.\nint main() {\n  char s[100];\n\n  // Read input string.\n  scanf(\"%s\", s);\n\n  // Print in reverse order.\n  int len = strlen(s);\n  for (int i = len - 1; i >= 0; i--) {\n    printf(\"%c\", s[i]);\n  }\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const text = parseText(values.text, 'hello');
        const steps = [];
        let reversed = '';
        for (let i = text.length - 1; i >= 0; i--) {
          steps.push({ text: `Take character '${text[i]}' from the end.`, line: lineMap.loop });
          reversed += text[i];
        }
        return { steps, output: `Reverse = ${reversed}` };
      },
      lineMatches: {
        loop: 'for (int i = len - 1; i >= 0; i--) {'
      }
    },
    {
      id: 'sumofdigits',
      file: 'sumofdigits.c',
      note: 'Sum all digits of a number.',
      updated: '',
      inputs: [{ name: 'n', label: 'Number', type: 'number', placeholder: '254', defaultValue: '254' }],
      code: `#include <stdio.h>\n\n// Sum all digits of a number.\nint main() {\n  int n, sum = 0;\n\n  // Read input.\n  scanf(\"%d\", &n);\n\n  // Extract each digit and add to sum.\n  while (n > 0) {\n    sum += n % 10;\n    n /= 10;\n  }\n  printf(\"%d\", sum);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        let n = parseNumber(values.n, 254);
        const steps = [];
        let sum = 0;
        while (n > 0) {
          const digit = n % 10;
          sum += digit;
          steps.push({ text: `Add digit ${digit}: sum = ${sum}.`, line: lineMap.loop });
          n = Math.floor(n / 10);
        }
        return { steps, output: `Sum of digits = ${sum}` };
      },
      lineMatches: {
        loop: 'while (n > 0) {'
      }
    },
    {
      id: 'sumofseries',
      file: 'sumofseries.c',
      note: 'Sum the series 1..N.',
      updated: '',
      inputs: [{ name: 'n', label: 'N', type: 'number', placeholder: '5', defaultValue: '5' }],
      code: `#include <stdio.h>\n\n// Sum the series 1..N.\nint main() {\n  int n, i, sum = 0;\n\n  // Read N.\n  scanf(\"%d\", &n);\n\n  // Add from 1 to N.\n  for (i = 1; i <= n; i++) {\n    sum += i;\n  }\n  printf(\"%d\", sum);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        const n = parseNumber(values.n, 5);
        const steps = [];
        let sum = 0;
        for (let i = 1; i <= n; i++) {
          sum += i;
          steps.push({ text: `Add ${i}: sum = ${sum}.`, line: lineMap.loop });
        }
        return { steps, output: `Sum = ${sum}` };
      },
      lineMatches: {
        loop: 'for (i = 1; i <= n; i++) {'
      }
    },
    {
      id: 'swap',
      file: 'swap.c',
      note: 'Swap two numbers using a temporary variable.',
      updated: '',
      inputs: [
        { name: 'a', label: 'A', type: 'number', placeholder: '7', defaultValue: '7' },
        { name: 'b', label: 'B', type: 'number', placeholder: '3', defaultValue: '3' }
      ],
      code: `#include <stdio.h>\n\n// Swap two numbers using a temporary variable.\nint main() {\n  int a, b, temp;\n\n  // Read two inputs.\n  scanf(\"%d%d\", &a, &b);\n\n  // Swap values.\n  temp = a;\n  a = b;\n  b = temp;\n\n  printf(\"%d %d\", a, b);\n  return 0;\n}`,
      simulate: (values, lineMap) => {
        let a = parseNumber(values.a, 7);
        let b = parseNumber(values.b, 3);
        const steps = [{ text: `Start with a=${a}, b=${b}.`, line: lineMap.assign }];
        const temp = a;
        a = b;
        b = temp;
        steps.push({ text: `After swap: a=${a}, b=${b}.`, line: lineMap.assign });
        return { steps, output: `After swap: a=${a}, b=${b}` };
      },
      lineMatches: {
        assign: 'temp = a;'
      }
    }
  ];

  let currentProgram = programs[0];
  let steps = [];
  let stepIndex = 0;
  let output = '';
  let intervalId = null;
  let currentLine = null;

  const stopAuto = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const parseList = (value, fallback) => {
    if (!value) {
      return fallback || [];
    }
    const items = value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map(Number)
      .filter((item) => Number.isFinite(item));
    return items.length ? items : fallback || [];
  };

  const parseNumber = (value, fallback) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const parseText = (value, fallback) => {
    const text = String(value ?? '').trim();
    return text.length ? text : fallback;
  };

  const renderProgramGrid = (items) => {
    if (!gridEl) {
      return;
    }
    gridEl.innerHTML = '';
    items.forEach((program) => {
      const card = document.createElement('article');
      card.className = 'program-card selectable';
      card.dataset.program = program.id;
      card.innerHTML = `
        <div class="program-header">
          <div>
            <h4>${program.file}</h4>
            <p class="practice-note">${program.note}</p>
          </div>
          <span class="practice-time">${program.updated}</span>
        </div>
      `;
      card.addEventListener('click', () => selectProgram(program.id));
      gridEl.appendChild(card);
    });
  };

  const applyFilter = () => {
    const query = String(searchInput ? searchInput.value : '').trim().toLowerCase();
    const filtered = programs.filter((program) => {
      return (
        program.file.toLowerCase().includes(query) ||
        program.note.toLowerCase().includes(query)
      );
    });
  renderProgramGrid(filtered);
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} program${filtered.length === 1 ? '' : 's'}`;
    }
    highlightActive(currentProgram.id);
  };

  if (gridEl) {
    gridEl.addEventListener('click', (event) => {
      const card = event.target.closest('.program-card');
      if (card && card.dataset.program) {
        selectProgram(card.dataset.program);
      }
    });
  }

  const renderInputs = () => {
    inputEl.innerHTML = '';
    currentProgram.inputs.forEach((input) => {
      const field = document.createElement('label');
      field.className = 'input-field';
      const inputElmt = document.createElement('input');
      inputElmt.type = input.type === 'number' ? 'number' : 'text';
      inputElmt.name = input.name;
      inputElmt.placeholder = input.placeholder || '';
      inputElmt.value = input.defaultValue || '';
      field.innerHTML = `<span>${input.label}</span>`;
      field.appendChild(inputElmt);
      inputEl.appendChild(field);
    });
  };

  const readInputs = () => {
    const values = {};
    currentProgram.inputs.forEach((input) => {
      const inputNode = inputEl.querySelector(`input[name="${input.name}"]`);
      values[input.name] = inputNode ? inputNode.value : '';
    });
    return values;
  };

  const renderSteps = () => {
    stepListEl.innerHTML = '';
    steps.forEach((step, idx) => {
      const item = document.createElement('li');
      item.className = 'step-item';
      item.textContent = step.text;
      if (idx < stepIndex) {
        item.classList.add('done');
      } else if (idx === stepIndex) {
        item.classList.add('active');
      }
      stepListEl.appendChild(item);
    });
  };

  const setConsole = (lines) => {
    consoleEl.textContent = lines.join('\n');
  };

  const appendConsole = (line) => {
    const current = consoleEl.textContent.trim();
    const next = current.length ? `${current}\n${line}` : line;
    consoleEl.textContent = next;
  };

  const updateStatus = () => {
    stepCountEl.textContent = `${Math.min(stepIndex, steps.length)}/${steps.length}`;
    if (!steps.length) {
      stepStatusEl.textContent = 'Steps ready';
      return;
    }
    if (stepIndex >= steps.length) {
      stepStatusEl.textContent = 'Execution finished';
    } else {
      stepStatusEl.textContent = `Running step ${stepIndex + 1}`;
    }
  };

  const buildSimulation = () => {
    const values = readInputs();
    const result = currentProgram.simulate(values, currentProgram.lineMap);
    steps = result.steps.map((step) => {
      if (typeof step === 'string') {
        return { text: step, line: currentProgram.lineMap.default };
      }
      return step;
    });
    output = result.output;
    stepIndex = 0;
    currentLine = currentProgram.lineMap.input || currentProgram.lineMap.default;
    setConsole(['Console ready.']);
    renderSteps();
    updateStatus();
    if (currentStepTextEl) {
      currentStepTextEl.textContent = 'Select a program and click Step.';
    }
    renderCode(currentLine);
  };

  const stepOnce = () => {
    try {
    if (!steps.length) {
      buildSimulation();
    }
    if (stepIndex < steps.length) {
      const step = steps[stepIndex];
      currentLine = step.line;
      appendConsole(`Step ${stepIndex + 1}: ${step.text}`);
      if (currentStepTextEl) {
        currentStepTextEl.textContent = step.text;
      }
      renderCode(currentLine);
      stepIndex += 1;
      renderSteps();
      updateStatus();
    }
    if (stepIndex >= steps.length) {
      appendConsole(`Output: ${output}`);
      stopAuto();
    }
    } catch (error) {
      setConsole([`Error: ${error.message || error}`]);
      stopAuto();
    }
  };

  const runAll = () => {
    try {
    buildSimulation();
    setConsole(['Console ready.']);
    steps.forEach((step, idx) => {
      appendConsole(`Step ${idx + 1}: ${step.text}`);
    });
    stepIndex = steps.length;
    currentLine = null;
    appendConsole(`Output: ${output}`);
    if (currentStepTextEl) {
      currentStepTextEl.textContent = 'Execution finished.';
    }
    renderCode(currentLine);
    renderSteps();
    updateStatus();
    } catch (error) {
      setConsole([`Error: ${error.message || error}`]);
    }
  };

  const resetAll = () => {
    stopAuto();
    steps = [];
    stepIndex = 0;
    output = '';
    currentLine = currentProgram?.lineMap?.input || currentProgram?.lineMap?.default || null;
    setConsole(['Console ready.']);
    if (currentStepTextEl) {
      currentStepTextEl.textContent = 'Select a program and click Step.';
    }
    renderCode(currentLine);
    renderSteps();
    updateStatus();
  };

  const selectProgram = (id) => {
    const program = programs.find((item) => item.id === id);
    if (!program) {
      return;
    }
    currentProgram = program;
    titleEl.textContent = program.file;
    noteEl.textContent = program.note;
    tagEl.textContent = 'Practice';
    renderInputs();
    resetAll();
    if (currentStepTextEl) {
      currentStepTextEl.textContent = `Loaded ${program.file}. Click Step to begin.`;
    }
    highlightActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const highlightActive = (id) => {
    if (!gridEl) {
      return;
    }
    const cards = gridEl.querySelectorAll('.program-card');
    cards.forEach((card) => {
      card.classList.toggle('active', card.dataset.program === id);
    });
  };

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const createLineMap = (code, matches) => {
    const lines = code.split('\n');
    const map = {};
    const defaultIndex = Math.max(1, lines.findIndex((line) => line.includes('int main')) + 1);
    map.default = defaultIndex || 1;
    if (!matches) {
      ['input', 'loop', 'loopBody', 'result', 'cond', 'swap', 'assign'].forEach((key) => {
        map[key] = map.default;
      });
      return map;
    }
    Object.keys(matches).forEach((key) => {
      const needle = matches[key];
      const index = lines.findIndex((line) => line.includes(needle));
      map[key] = index >= 0 ? index + 1 : map.default;
    });
    ['input', 'loop', 'loopBody', 'result', 'cond', 'swap', 'assign'].forEach((key) => {
      if (!map[key]) {
        map[key] = map.default;
      }
    });
    return map;
  };

  function renderCode(lineNumber) {
    if (!codeEl) {
      return;
    }
    const lines = currentProgram.code.split('\n');
    codeEl.innerHTML = lines
      .map((line, index) => {
        const number = index + 1;
        const active = number === lineNumber ? ' active' : '';
        return `<span class="code-line${active}" data-line="${number}"><span class="line-no">${number}</span><span class="line-text">${escapeHtml(line)}</span></span>`;
      })
      .join('\n');
    if (lineNumber) {
      const activeLine = codeEl.querySelector(`[data-line="${lineNumber}"]`);
      if (activeLine) {
        activeLine.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  const copyCode = async () => {
    if (!navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(currentProgram.code);
      if (copyCodeBtn) {
        copyCodeBtn.textContent = 'Copied';
        setTimeout(() => {
          copyCodeBtn.textContent = 'Copy code';
        }, 1200);
      }
    } catch (error) {
      setConsole([`Error: ${error.message || error}`]);
    }
  };

  programs.forEach((program) => {
    program.lineMap = createLineMap(program.code, program.lineMatches);
  });

  applyFilter();
  selectProgram(programs[0].id);

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  runBtn.addEventListener('click', runAll);
  stepBtn.addEventListener('click', stepOnce);
  autoBtn.addEventListener('click', () => {
    if (intervalId) {
      return;
    }
    intervalId = setInterval(stepOnce, 700);
  });
  pauseBtn.addEventListener('click', stopAuto);
  resetBtn.addEventListener('click', resetAll);
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', copyCode);
  }
}
