import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/sections/hero"
import { Story } from "@/components/sections/story"
import { Pillars } from "@/components/sections/pillars"
import { CollectionsShowcase } from "@/components/sections/collections-showcase"
import { HamperBuilder } from "@/components/sections/hamper-builder"
import { Unboxing } from "@/components/sections/unboxing"
import { Audience } from "@/components/sections/audience"
import { ClosingCta } from "@/components/sections/closing-cta"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Story />
        <Pillars />
        <CollectionsShowcase />
        <HamperBuilder />
        <Unboxing />
        <Audience />
        <ClosingCta />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
