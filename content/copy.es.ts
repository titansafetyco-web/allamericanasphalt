import { pageCopy } from "@/content/copy";

type Stringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Stringify<U>[]
    : T extends object
      ? { [K in keyof T]: Stringify<T[K]> }
      : T;

export const pageCopyEs: Stringify<typeof pageCopy> = {
  home: {
    heroKicker: "West Palm Beach • Fort Lauderdale • Stuart",
    heroTitle: "Pavimentación en el sur de la Florida,\nDe principio a fin.",
    heroBody:
      "George Stevens, dueño de All American Asphalt, es un contratista comercial de asfalto y pavimentación en West Palm Beach, FL, con más de 30 años de experiencia. Atendemos municipios, distritos escolares, estacionamientos, centros comerciales, iglesias, asociaciones de propietarios, caminos privados y entradas residenciales. También hacemos asfalto, reductores de velocidad y sellado/rayado. Ofrecemos servicio el mismo día en West Palm Beach, Fort Lauderdale, Plantation y Davie, FL, y ningún trabajo es demasiado grande o pequeño. Estamos licenciados, afianzados y asegurados. ¡Su satisfacción está garantizada!",
    midTitle: "Servicios de asfalto comercial y residencial",
    midBody:
      "En All American Asphalt LLC, usted y sus necesidades de superficie son nuestra prioridad. Trabajamos directo con cada cliente para entender lo que necesita y entregar resultados excelentes. En Broward, Palm Beach y Martin, propietarios residenciales y comerciales nos llaman cuando necesitan una empresa de pavimentación comprobada. Nuestros contratistas en West Palm Beach se especializan en pavimentación, reparación y resurfacing. Ya sea sobrecapa para su estacionamiento o fresado para su entrada, cuente con nosotros. Grande o pequeño, su superficie quedará impecable.",
    whyTitle: "¿Por qué contratarnos?",
    whyLead: "Pavimentamos su camino a la satisfacción",
    whyBody: [
      "Obtenga ayuda del equipo experto de All American Asphalt: una empresa de pavimentación de servicio completo en West Palm Beach. Hacemos preparación del sitio y pavimentación para construcción nueva, incluyendo subrasante, base de roca y asfalto. Hacemos de todo: estacionamientos, caminos privados y entradas residenciales.",
      "Resuperficie o repavimente su asfalto existente con mezcla caliente nueva, con o sin nivelación después de una evaluación profesional. También puede incluir retiro del asfalto viejo y retrabajo de la base antes de la sobrecapa.",
    ],
    whyPoints: [
      "Empresa de pavimentación con licencia, fianza y seguro.",
      "Recibimos calificación A+ del Better Business Bureau (BBB) y de la Cámara de Comercio.",
      "Nuestro equipo maneja cada aspecto del proyecto, de principio a fin.",
      "Somos conocidos por precios competitivos y el mejor servicio al cliente.",
      "Hay servicio el mismo día en ciertos trabajos. El resto se programa.",
    ],
    award:
      "Nos complace informar que All American Asphalt LLC fue reconocida como una de las 3 mejores de 2026 en West Palm Beach en la categoría de contratista de asfalto — un honor basado en reseñas verificadas y trayectoria profesional.",
  },
  asphalt: {
    title: "Servicios de pavimentación de asfalto en West Palm Beach, FL",
    intro:
      "All American Asphalt LLC es un contratista de pavimentación de servicio completo que ofrece asfalto en West Palm Beach, FL y atiende Plantation y Davie, FL. Nos especializamos en todos los servicios de asfalto, desde sobrecapas hasta sellado. Propiedades comerciales y residenciales usan asfalto para estacionamientos, entradas, senderos y calles menores. Cuando necesitan pavimentar, resurfacing o reparación, confían en nosotros.",
    sections: [
      {
        title: "La opción de West Palm Beach para pavimentación de asfalto",
        body: [
          "Las reparaciones de asfalto se hacen necesarias por muchas razones. El primer paso es identificar la causa del daño. A veces es obvio, como raíces que rompieron la superficie o químicos corrosivos como fluido hidráulico. Otras veces un mal drenaje deja charcos que dañan el asfalto con el tiempo.",
          "Al reparar, primero se corta y retira un área más grande alrededor del hueco. Si la base de roca necesita atención, se nivela para crear una superficie pareja. Luego se aplica una capa de tack, o emulsión de asfalto, para asegurar la adhesión. Se instala mezcla caliente, se compacta al espesor correcto y un rodillo crea una transición suave hacia el asfalto existente.",
        ],
      },
      {
        title: "Sobrecapas y reparación expertas",
        body: [
          "Una capa nueva de asfalto puede devolver rápido el aspecto original a su estacionamiento o calle. Añadir espesor aumenta la integridad estructural y deja un acabado liso. El asfalto nuevo se puede colocar sobre asfalto existente: eso es una sobrecapa. También se puede pavimentar sobre una capa suficiente de base de roca aprobada por el DOT. Las áreas que requieren reconstrucción total se excavarán primero.",
          "El primer paso de cualquier pavimentación es crear una superficie ideal. Puede incluir rellenar zonas bajas o huecos con base, retirar topes, o limpiar escombros. Además, las transiciones se pueden fresar y las estructuras de drenaje ajustarse al nuevo nivel. Una vez preparado, se aplica tack y luego mezcla caliente en una capa pareja con la pavimentadora, compactada con rodillo vibratorio de tambor de acero.",
        ],
      },
      {
        title: "Fresado de asfalto",
        body: [
          "El material de fresado, también conocido como asfalto reciclado (RAP), proviene de proyectos anteriores que se retiraron y trituraron. Es más económico y ecológico que el asfalto virgen, por eso más personas lo eligen, especialmente en construcción residencial. Según su proyecto, puede ofrecer beneficios únicos frente a grava o asfalto tradicional. Eso no significa que sea la opción correcta para usted. Llámenos y le ayudamos a decidir.",
        ],
      },
    ],
  },
  seal: {
    title: "Servicios de sellado de asfalto en West Palm Beach, FL",
    intro:
      "Ofrecemos sellador de látex cauchutado para alto tráfico, un protector profesional que ayuda a extender la vida del asfalto y mantenerlo como nuevo. Su propiedad es un gran activo. Proteja su valor y belleza con sellado de calidad en West Palm Beach, FL de All American Asphalt LLC. Sellar cada dos años es la mejor forma de mantener la apariencia y proteger el asfalto.",
    patchwork:
      "Obtenga parches que incluyen corte con sierra, retrabajo de la base donde hace falta y repavimentación. Incluye huecos, daño por aceite, raíces y hundimientos. Usamos material profesional Gem Seal. Después de limpiar y preparar, aplicamos un proceso de 2 capas con máquina de aspersión o squeegee a mano.",
    gemSeal: [
      "Sellador de pavimento Gem Seal",
      "Extiende mucho la vida del asfalto",
      "Excelente dureza y flexibilidad",
      "Embellece y mantiene el pavimento como nuevo",
      "Ahorra en mantenimiento regular",
      "Evita la penetración de agua",
      "Resiste gasolina, aceite, sal y petroquímicos",
      "Detiene la oxidación por rayos UV",
      "Color negro intenso",
      "Fácil de limpiar, rayar y mantener",
    ],
    striping:
      "Las líneas, palabras y símbolos en estacionamientos y calles alertan a conductores y peatones sobre el flujo del tráfico e indican zonas especiales como carriles de incendio, cruces y carga. Con el tiempo se desvanecen por el sol y el uso. El rayado se hace después del sellado o la pavimentación. Las marcas se aplican con pintura para tráfico, con máquina o a mano, y también usamos plantillas para letras y símbolos. ¡Nuestras pinturas están aprobadas por el D.O.T.!",
  },
  speed: {
    title: "Instalación de reductores y bolardos en West Palm Beach, FL",
    intro:
      "All American Asphalt LLC se especializa en la instalación y reparación de dispositivos de control de velocidad y bolardos en West Palm Beach, FL y alrededores. Los reductores bajan la velocidad y mejoran la seguridad en calles y estacionamientos; los bolardos protegen peatones, propiedad e infraestructura. Confíe en nuestro equipo para instalaciones precisas y reparaciones a tiempo.",
    devices:
      "Clientes en West Palm Beach nos buscan para instalar reductores. Dispositivos como bumps, humps y tables mantienen condiciones seguras. Según el espacio, instalamos el tipo que mejor se adapte. Asfalto, caucho reciclado o plástico son los materiales principales. Una vez instalados, los pintamos como se requiera, ya sea amarillo sólido o chevrones. Por supuesto, también reparamos unidades rotas o deterioradas.",
    bollards:
      "Otro dispositivo de seguridad que instalamos y damos servicio son los bolardos. Se usan en estacionamientos para crear una barrera entre conductores y aceras, entradas, hidrantes y tuberías. Vienen en distintos tamaños, con tope cónico, esférico o plano, pintados o con funda. Nuestro equipo completa cada paso de la instalación o reparación, de principio a fin.",
  },
  contact: {
    title: "Contacte a All American Asphalt LLC",
    intro:
      "All American Asphalt LLC ofrece soluciones completas de asfalto para propietarios comerciales y residenciales en Fort Lauderdale, Plantation y Davie, FL y condados cercanos. Nuestros servicios incluyen fresado, resurfacing y sellado. También instalamos y reparamos dispositivos de control de velocidad y seguridad como reductores y bolardos. Nuestro equipo experimentado, diligente y cortés maneja cada proyecto de principio a fin.",
    prompt:
      "Para saber más de nuestros servicios o para un estimado gratis, complete el formulario de contacto o llámenos.",
  },
  referrals: {
    intro:
      "Conocidos por nuestro excelente servicio de asfalto, All American Asphalt LLC maneja desde entradas hasta sellado en West Palm Beach, FL. Nuestra reputación nos permite crecer por referencias. Clientes satisfechos nos recomiendan a amigos, familia, vecinos y colegas. Estamos muy agradecidos con todos los que nos han apoyado a lo largo de los años.",
    give: "Desde que fundamos la empresa en 2004, hemos trabajado con organizaciones en Martin, Palm Beach, Broward y Dade. Completamos proyectos de asfalto y sellado para comunidades, contratistas generales, administradores, parques, iglesias, centros comerciales y escuelas. Si desea referencias de clientes, podemos proporcionarlas. Tenemos una larga lista de clientes satisfechos dispuestos a hablar de su experiencia.",
    get: "Además de dar referencias, aceptamos recomendaciones para cualquier trabajo. No hay proyecto demasiado grande o pequeño. Si alguien lo refirió, comparta su nombre. Queremos servirle bien y agradecer a quien nos recomendó. Contratistas y constructores nos han dicho lo difícil que es encontrar expertos de asfalto de confianza en West Palm Beach, FL. Con los años formamos relaciones sólidas y somos su fuente principal para trabajo de asfalto.",
  },
  terms: {
    intro:
      "Estos términos y condiciones describen las reglas de uso del sitio web de All American Asphalt LLC, ubicada en 1645 Palm Beach Lakes Blvd Suite 1200, West Palm Beach, FL 33401. Al acceder a este sitio asumimos que acepta estos términos por completo. No continúe usando el sitio si no acepta todas las condiciones de esta página.",
    comments: [
      "Ciertas partes de este sitio permiten publicar opiniones, información y datos (“Comentarios”). All American Asphalt LLC no filtra, edita, publica ni revisa los Comentarios antes de que aparezcan, y no reflejan las opiniones de All American Asphalt LLC, sus agentes o afiliados. Reflejan la opinión de quien los publica. En la medida permitida por la ley, All American Asphalt LLC no será responsable de los Comentarios ni de pérdidas, costos, daños o gastos causados por su uso o publicación en este sitio.",
      "All American Asphalt LLC se reserva el derecho de monitorear todos los Comentarios y de eliminar los que considere inapropiados, ofensivos o que incumplan estos Términos.",
      "Usted garantiza que tiene derecho a publicar los Comentarios y las licencias y consentimientos necesarios; que no infringen propiedad intelectual de terceros; y que no contienen material difamatorio, ofensivo, indecente o ilegal, ni se usan para solicitar negocio o actividad ilícita.",
    ],
  },
};
