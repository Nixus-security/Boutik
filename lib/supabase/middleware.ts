import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // getSession() lit la session depuis le cookie, sans aller-retour réseau vers Supabase Auth
  // (contrairement à getUser()) : ce contrôle ne sert qu'à rediriger côté UI, l'autorisation
  // réelle sur les données est de toute façon revalidée par les policies RLS à chaque requête.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const path = request.nextUrl.pathname;
  const isDemo = request.cookies.get("boutik_demo")?.value === "1";
  const isAuthRoute = path.startsWith("/connexion") || path.startsWith("/inscription");
  const isProtected = path.startsWith("/app");

  // Un utilisateur réellement connecté ne doit jamais rester coincé en mode démo : sinon
  // lib/demo.ts (isDemo() en premier partout) continue de servir les données de démo au lieu
  // de son vrai compte, même après une connexion réussie. On l'applique sur toute réponse
  // renvoyée ci-dessous, y compris les redirections (qui sont des objets Response distincts).
  const clearDemoCookie = user && isDemo;
  function withDemoCookieCleared(res: NextResponse) {
    if (clearDemoCookie) res.cookies.set({ name: "boutik_demo", value: "", path: "/", maxAge: 0 });
    return res;
  }

  if (isProtected && !user && !isDemo) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return withDemoCookieCleared(NextResponse.redirect(url));
  }

  return withDemoCookieCleared(response);
}
