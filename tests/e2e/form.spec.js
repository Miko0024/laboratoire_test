
const { test, expect } = require('@playwright/test');


test.describe('Form Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test.describe('Inscription/Subscription', () => {
    test('devrait refuser si courriel et mot de passe sont vides', async ({ page }) => {
      await page.fill('input[name="email"]', '');
      await page.fill('input[name="password"]', '');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait refuser si courriel est vide', async ({ page }) => {
      await page.fill('input[name="email"]', '');
      await page.fill('input[name="password"]', 'labo1234');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait refuser si format courriel incorrect', async ({ page }) => {
      await page.fill('input[name="email"]', 'labotestgmail.com');
      await page.fill('input[name="password"]', 'labo1234');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait refuser si mot de passe est vide', async ({ page }) => {
      await page.fill('input[name="email"]', 'labotest@gmail.com');
      await page.fill('input[name="password"]', '');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait refuser si format mot de passe incorrect', async ({ page }) => {
      await page.fill('input[name="email"]', 'labotest@gmail.com');
      await page.fill('input[name="password"]', '1234');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait accepter si courriel et mot de passe corrects', async ({ page }) => {
      await page.fill('input[name="email"]', 'labotest@gmail.com');
      await page.fill('input[name="password"]', 'labo1234');
      await page.click('button[type="submit"]');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Correct');
      });
     
      page.on('response', async (response) => {
        if (response.url().includes('/api/login')) {  
          const data = await response.json();
          expect(data.isLoggedIn).toBe(true);  
        }
      });
    });
  });

  test.describe('Gestion des tâches', () => {
    test.beforeEach(async ({ page }) => {
      // Se connecter avant les tests de tâches
      await page.fill('input[name="email"]', 'labotest@gmail.com');
      await page.fill('input[name="password"]', 'labo1234');
      await page.click('button[type="submit"]');
    });

    test('devrait refuser ajout tâche avec titre vide', async ({ page }) => {
      await page.waitForSelector('input[name="taskTitle"]');
      await page.fill('input[name="taskTitle"]', '');
      await page.click('button.add-task');
      const result = await page.evaluate(() => {
        return document.querySelector('form').textContent.includes('Erreur');
      });
      expect(result).toBeTruthy();
    });

    test('devrait accepter ajout tâche avec titre valide', async ({ page }) => {
      const taskTitle = 'Rediger le labo';
      await page.fill('input[name="taskTitle"]', taskTitle);
      await page.click('button.add-task');
      
      await page.waitForTimeout(1000);

      // Récupérer l'ID de la tâche après l'ajout
      const taskElement = await page.locator(`.task-list .task:has-text("${taskTitle}")`);
      const taskId = await taskElement.getAttribute('data-id');  

      // Vérifier que l'ID existe
      expect(taskId).toBeDefined();

      
      const tasksFilePath = path.join(__dirname, 'tasks.json'); 
      const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));

      // Vérifier que la tâche avec l'ID récupéré existe dans le fichier JSON
      const taskFound = tasksData.tasks.some(task => task.id === taskId);
      expect(taskFound).toBe(true);  // Vérifie que la tâche avec cet ID existe
    });


    test('devrait refuser suppression tâche par non-créateur', async ({ page }) => {
      const taskTitle = 'Rediger le labo';
      // Vérifier que la tâche existe d'abord
      const taskElement = page.locator(`.task-list :text("${taskTitle}")`);
      await expect(taskElement).toBeVisible();
      
      // Cliquer sur le bouton de suppression associé à cette tâche spécifique
      await page.click(`.task-list :text("${taskTitle}") ~ .delete-button`);
      
      // Vérifier que la tâche n'existe plus
      await expect(taskElement).not.toBeVisible();
    });

    test('devrait accepter suppression tâche par créateur', async ({ page }) => {
      const initialContent = await page.evaluate(() => {
        return document.querySelector('.task-list').textContent;
      });
      await page.click('.delete-button');
      const finalContent = await page.evaluate(() => {
        return document.querySelector('.task-list').textContent;
      });
      expect(finalContent).not.toEqual(initialContent);
    });
  });
});