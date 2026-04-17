import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# 🔥 Chrome options (important for Vercel apps)
options = Options()
options.add_argument("--start-maximized")
options.add_argument("--ignore-certificate-errors")
options.add_argument("--disable-web-security")
options.add_argument("--allow-running-insecure-content")

driver = webdriver.Chrome(options=options)

driver.get("https://medu-exp.vercel.app/login")

# 🔥 Wait for React to render
for i in range(30):
    html = driver.page_source

    if "<input" in html:
        print("✅ Page loaded properly")
        break

    print("⏳ Waiting...")
    time.sleep(0.5)
else:
    print("❌ Still not loading — issue is NOT Selenium")
    driver.save_screenshot("error.png")
    driver.quit()
    exit()

# --- Now interact ---
inputs = driver.find_elements(By.TAG_NAME, "input")

print("Inputs found:", len(inputs))

email = inputs[0]
password = inputs[1]

email.send_keys("niharika30@somaiya.edu")
password.send_keys("Tanish@23")

driver.find_element(By.TAG_NAME, "button").click()

time.sleep(3)

driver.save_screenshot("final.png")
print("✅ Done")

driver.quit()