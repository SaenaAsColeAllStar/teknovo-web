type Props = { params: Promise<{ id: string }> };

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
        Edit berita
      </h1>
      <p className="text-sm text-[color:var(--color-body)]">
        Scaffold untuk ID <code>{id}</code> — muat via `GET /v1/berita/:id`.
      </p>
    </div>
  );
}
