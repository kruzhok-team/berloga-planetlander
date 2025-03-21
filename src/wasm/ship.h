#ifndef SHIP_H
#define SHIP_H

#include "utils.h"

typedef struct {
  float width, height;

  float mass;
  float J;

  Vector r, v, f;
  float phi, w, M;

  int isActive;
  int isExploded;
  float fuel;
} Ship;

extern Ship s;
/*extern float gravity;*/

void ShipInit(int x, int y);
void ShipStep(float dt);
void ShipAddForce(float x, float y);

#endif
