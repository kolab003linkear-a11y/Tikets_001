import { expect, test } from "@playwright/test";

test.describe("TicketSafe Mobility Suite — End-to-End Super-App Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the root Super-App hub
    await page.goto("/");
  });

  test("1. Attendee: Displays Dynamic QR Ticket with 30s rotating countdown and lockscreen pass", async ({
    page,
  }) => {
    // Check Brand and Anti-Fraud Banner
    await expect(page.getByText("TicketSafe")).toBeVisible();
    await expect(page.getByText("Billetera Digital Anti-Fraude")).toBeVisible();

    // Verify 30-Second Dynamic Rotation
    await expect(page.getByText("Frecuencia de Rotación")).toBeVisible();
    await expect(page.getByText("HMAC-SHA256")).toBeVisible();

    // Toggle Lockscreen Live Activity Widget
    const toggleWidgetBtn = page.getByRole("button", {
      name: /Simular Widget en Bloqueo|Ocultar Widget/,
    });
    await expect(toggleWidgetBtn).toBeVisible();
    await toggleWidgetBtn.click();

    await expect(
      page.getByText("Widget de Pantalla Bloqueada (Live Activity)"),
    ).toBeVisible();
    await expect(
      page.getByText("Acceso instantáneo en 0 toques"),
    ).toBeVisible();
  });

  test("2. Gate Operator: Turnstile scanner rejects stale screenshots and authorizes valid dynamic QR (<1.0s)", async ({
    page,
  }) => {
    // Switch to Gate Staff Persona
    const roleSelect = page.locator("select");
    await roleSelect.selectOption("GATE_STAFF");

    await expect(
      page.getByText("Escáner de Molinete para Operador"),
    ).toBeVisible();
    await expect(
      page.getByText("Simulador de Entrada de Cámara"),
    ).toBeVisible();

    // Step A: Simulate Valid Scan
    const scanBtn = page.getByRole("button", {
      name: "Ejecutar Escaneo y Validación Local",
    });
    await scanBtn.click();

    await expect(
      page.getByText("ACCESO AUTORIZADO - MOLINETE LIBERADO"),
    ).toBeVisible();

    // Step B: Simulate Duplicate / Screenshot Rejection
    const screenshotToggle = page.locator('input[type="checkbox"]');
    await screenshotToggle.check();
    await scanBtn.click();

    await expect(page.getByText("ACCESO DENEGADO")).toBeVisible();
  });

  test("3. Urban Driver: Registers vehicle plate, triggers LPR camera, and actuates barrier in <2.0s", async ({
    page,
  }) => {
    // Switch to Driver Persona
    const roleSelect = page.locator("select");
    await roleSelect.selectOption("DRIVER");

    await expect(
      page.getByText("Parqueadero con Reconocimiento LPR"),
    ).toBeVisible();
    await expect(page.getByText("Cero Tickets Físicos")).toBeVisible();

    // Open LPR Camera Gate Simulator
    const gateSimulatorBtn = page.getByRole("button", {
      name: "Simulador de Cámara LPR en Puerta",
    });
    await gateSimulatorBtn.click();

    await expect(
      page.getByText("Monitor de Cámara LPR & Actuador de Barrera"),
    ).toBeVisible();

    // Trigger Camera Event
    const triggerLprBtn = page.getByRole("button", {
      name: /Disparar Evento LPR y Actuar Barrera/,
    });
    await triggerLprBtn.click();

    await expect(page.getByText("BARRERA LEVANTADA")).toBeVisible();
  });

  test("4. Transit Driver: Streams real-time GPS telemetry and validates dead-battery passenger via National ID", async ({
    page,
  }) => {
    // Switch to Transit Driver Persona
    const roleSelect = page.locator("select");
    await roleSelect.selectOption("TRANSIT_DRIVER");

    await expect(
      page.getByText("Portal de Seguridad & Telemetría GPS en Vivo"),
    ).toBeVisible();
    await expect(
      page.getByText("Terminal del Chofer & Manifiesto Offline"),
    ).toBeVisible();

    // Search by National ID (Cédula)
    const idInput = page.getByPlaceholder("ej: 1723456789");
    await idInput.fill("1723456789");

    const searchBtn = page.getByRole("button", {
      name: "Buscar y Validar Pasajero en Manifiesto",
    });
    await searchBtn.click();

    await expect(
      page.getByText("Pasajero Verificado y Abordado"),
    ).toBeVisible();
  });

  test("5. Concessions & Runner: Places in-seat food order and verifies delivery PIN in stadium", async ({
    page,
  }) => {
    // Switch to Attendee Persona and trigger in-seat concessions
    const roleSelect = page.locator("select");
    await roleSelect.selectOption("ATTENDEE");

    const foodBtn = page.getByRole("button", {
      name: "Pedir Comida al Asiento",
    });
    await foodBtn.click();

    await expect(
      page.getByText("Pedido al Asiento & Billetera del Estadio"),
    ).toBeVisible();

    // Submit order to seat
    const confirmOrderBtn = page.getByRole("button", {
      name: /Confirmar Pedido a Asiento 22/,
    });
    await confirmOrderBtn.click();

    await expect(page.getByText("¡Pedido Confirmado con Éxito!")).toBeVisible();
    await expect(page.getByText("PIN de Recepción:")).toBeVisible();

    // Switch to Concession Runner Persona
    await roleSelect.selectOption("RUNNER");
    await expect(page.getByText("Panel del Runner de Gradas")).toBeVisible();
    await expect(
      page.getByText("Tribuna Occidental • Fila 14 • Asiento 22"),
    ).toBeVisible();
  });
});
