-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_email_key" ON "subscriptions"("email");
