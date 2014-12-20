module Angle where

  import Math (pi)

  newtype Degree = Degree Number

  newtype Radian = Radian Number

  deg2rad :: Degree -> Radian
  deg2rad (Degree d) = Radian $ d * pi / 180

  rad2deg :: Radian -> Degree
  rad2deg (Radian r) = Degree $ r * 180 / pi
