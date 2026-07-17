"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  beritaFormSchema,
  type BeritaFormValues,
} from "@/lib/api-client";

export default function BeritaBaruPage() {
  const form = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaFormSchema),
    defaultValues: {
      judul: "",
      slug: "",
      ringkasan: "",
      konten: "",
      status: "DRAFT",
      coverUrl: "",
    },
  });

  function onSubmit(values: BeritaFormValues) {
    toast.message("API belum terhubung", {
      description: `Draft "${values.judul}" siap dikirim ke POST /v1/berita.`,
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Berita baru
        </h1>
        <p className="text-sm text-[color:var(--color-body)]">
          Form scaffold dengan Zod + react-hook-form. TipTap editor dapat
          dipasang di field konten.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="judul">Judul</Label>
          <Input id="judul" {...form.register("judul")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} placeholder="contoh-berita" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ringkasan">Ringkasan</Label>
          <Input id="ringkasan" {...form.register("ringkasan")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="konten">Konten (HTML / TipTap nanti)</Label>
          <textarea
            id="konten"
            className="min-h-40 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
            {...form.register("konten")}
          />
        </div>
        <Button type="submit" size="sm">
          Simpan draft
        </Button>
      </form>
    </div>
  );
}
