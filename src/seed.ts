import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SeedModule } from "src/seed/seed.module";
import { Seeder } from "src/seed/seeder";


async function startSeed() {
    NestFactory.createApplicationContext(SeedModule)
        .then(appContext => {
            const logger = appContext.get(Logger);
            const seeder = appContext.get(Seeder)
            seeder
                .seed()
                .then(() => {
                    logger.debug('Seeding complete!');
                })
                .catch(error => {
                    logger.error('Seeding failed!');
                    throw error;
                })
                .finally(() => appContext.close());
        })
        .catch(error => {
            throw error;
        });
}

startSeed();